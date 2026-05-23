from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime, timedelta
import hashlib
import secrets
import time
import requests

app = FastAPI(title="QuantumID")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
DATABASE_URL = "sqlite:///./quantumid.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String)
    phone = Column(String)
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# TextBee SMS Configuration
TEXTBEE_API_KEY = "967240c9-6fe3-48b9-987c-539ad6a6b161"
TEXTBEE_API_URL = "https://api.textbee.dev/api/v1/send"

def send_sms(phone_number: str, otp: str) -> bool:
    try:
        headers = {
            "Authorization": f"Bearer {TEXTBEE_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "to": phone_number,
            "message": f"🔐 Your QuantumID OTP is: {otp}. Valid for 5 minutes.",
            "sender": "QUANTUM"
        }
        response = requests.post(TEXTBEE_API_URL, json=data, headers=headers, timeout=10)
        return response.status_code == 200
    except Exception as e:
        print(f"SMS error: {e}")
        return False

# Store OTPs temporarily
otp_store = {}

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    phone: str

class LoginRequest(BaseModel):
    username: str
    password: str

class VerifyOTPRequest(BaseModel):
    username: str
    otp: str

@app.get("/")
def root():
    return {"status": "ok", "message": "QuantumID Backend Running"}

@app.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    new_user = User(
        username=req.username,
        email=req.email,
        phone=req.phone,
        password_hash=hash_password(req.password)
    )
    db.add(new_user)
    db.commit()
    
    return {"message": "Registration successful", "username": req.username}

@app.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.password_hash != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Generate Quantum OTP (simulated for now)
    import random
    otp = f"{random.randint(0, 999999):06d}"
    
    otp_store[req.username] = {
        "otp": otp,
        "expires_at": time.time() + 60
    }
    
    # Send SMS
    if user.phone:
        send_sms(user.phone, otp)
    
    return {
        "requires_2fa": True,
        "username": req.username,
        "message": "OTP sent to your phone"
    }

@app.post("/verify-2fa")
async def verify_2fa(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    stored = otp_store.get(req.username)
    if not stored:
        raise HTTPException(status_code=401, detail="No OTP request")
    
    if time.time() > stored["expires_at"]:
        del otp_store[req.username]
        raise HTTPException(status_code=401, detail="OTP expired")
    
    if stored["otp"] != req.otp:
        raise HTTPException(status_code=401, detail="Invalid OTP")
    
    del otp_store[req.username]
    
    user = db.query(User).filter(User.username == req.username).first()
    session_token = secrets.token_urlsafe(32)
    
    return {
        "message": "Login successful",
        "session_token": session_token,
        "username": req.username
    }

@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": [{"username": u.username, "email": u.email, "phone": u.phone} for u in users]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
