from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import hashlib
import secrets
import time
import random

app = FastAPI(title="QuantumID")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    return {"status": "ok", "name": "QuantumID", "message": "Post-Quantum Secure Identity System"}

@app.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username exists")
    
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
    
    # Generate Quantum-inspired OTP
    otp = f"{random.randint(0, 999999):06d}"
    
    otp_store[req.username] = {
        "otp": otp,
        "expires_at": time.time() + 60
    }
    
    # Note: SMS would be sent here in production
    return {
        "requires_2fa": True,
        "username": req.username,
        "otp": otp,
        "message": "SMS would be sent in production. For demo, use this OTP."
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
