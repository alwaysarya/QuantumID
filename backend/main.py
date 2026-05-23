from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import hashlib
import oqs
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from database import get_db, User, LoginHistory
from sms_service import sms_service
from email_service import email_service
from websocket_manager import manager
import time
from datetime import datetime
import secrets

app = FastAPI(title="QuantumID")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuantumRNG:
    def __init__(self):
        self.simulator = AerSimulator()
    
    def generate_otp(self, length=6):
        circuit = QuantumCircuit(8, 8)
        circuit.h(range(8))
        circuit.measure(range(8), range(8))
        compiled = transpile(circuit, self.simulator)
        result = self.simulator.run(compiled, shots=1).result()
        counts = result.get_counts()
        random_bits = list(counts.keys())[0]
        number = int(random_bits, 2) % (10 ** length)
        return str(number).zfill(length)
    
    def generate_session_token(self):
        circuit = QuantumCircuit(16, 16)
        circuit.h(range(16))
        circuit.measure(range(16), range(16))
        compiled = transpile(circuit, self.simulator)
        result = self.simulator.run(compiled, shots=1).result()
        counts = result.get_counts()
        return list(counts.keys())[0]

quantum_rng = QuantumRNG()

class PQCManager:
    def __init__(self):
        self.kem_algorithm = "Kyber512"
    
    def generate_keypair(self):
        with oqs.KeyEncapsulation(self.kem_algorithm) as kem:
            public_key = kem.generate_keypair()
            private_key = kem.export_secret_key()
        return public_key.hex(), private_key.hex()
    
    def hash_password(self, password):
        return hashlib.sha3_256(password.encode()).hexdigest()

pqc = PQCManager()

otp_store = {}

class RegisterRequest(BaseModel):
    username: str
    password: str
    email: str
    phone: str

class LoginRequest(BaseModel):
    username: str
    password: str

class Verify2FARequest(BaseModel):
    username: str
    otp: str

def log_login_attempt(db: Session, username: str, success: bool, failure_reason: str = None):
    log = LoginHistory(
        username=username,
        success=success,
        failure_reason=failure_reason,
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()

@app.get("/")
def root():
    return {"name": "QuantumID", "status": "ready"}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_alert("info", f"Received: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket, client_id)

@app.post("/register")
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == req.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username exists")
    
    public_key, private_key = pqc.generate_keypair()
    password_hash = pqc.hash_password(req.password)
    
    new_user = User(
        username=req.username,
        email=req.email,
        phone=req.phone,
        password_hash=password_hash,
        pq_public_key=public_key,
        pq_private_key=private_key
    )
    db.add(new_user)
    db.commit()
    
    # Send WebSocket alert
    await manager.send_alert("success", f"New user registered: {req.username}", "success")
    
    return {"message": "User registered with Kyber512", "username": req.username}

@app.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user:
        log_login_attempt(db, req.username, False, "User not found")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    input_hash = pqc.hash_password(req.password)
    if input_hash != user.password_hash:
        log_login_attempt(db, req.username, False, "Wrong password")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    quantum_otp = quantum_rng.generate_otp()
    
    otp_store[req.username] = {
        "otp": quantum_otp,
        "expires_at": time.time() + 60
    }
    
    # Send WebSocket alert for login attempt
    await manager.send_alert("warning", f"Login attempt for user: {req.username}", "info")
    
    # Send OTP via SMS and Email
    sms_sent = False
    email_sent = False
    
    if user.phone:
        sms_sent = sms_service.send_otp(user.phone, quantum_otp)
    
    if user.email:
        email_sent = email_service.send_otp_email(user.email, user.username, quantum_otp)
    
    if sms_sent or email_sent:
        message = "OTP sent to your phone and email"
    else:
        message = "Check your registered email for OTP"
    
    return {
        "requires_2fa": True,
        "username": req.username,
        "quantum_otp": quantum_otp if not (sms_sent or email_sent) else None,
        "message": message
    }

@app.post("/verify-2fa")
async def verify_2fa(req: Verify2FARequest, db: Session = Depends(get_db)):
    stored = otp_store.get(req.username)
    if not stored:
        raise HTTPException(status_code=401, detail="No OTP request")
    
    if time.time() > stored["expires_at"]:
        del otp_store[req.username]
        raise HTTPException(status_code=401, detail="OTP expired")
    
    if stored["otp"] != req.otp:
        raise HTTPException(status_code=401, detail="Invalid OTP")
    
    del otp_store[req.username]
    
    session_token = quantum_rng.generate_session_token()
    
    log_login_attempt(db, req.username, True)
    
    # Send WebSocket alert for successful login
    await manager.send_alert("success", f"✅ User {req.username} logged in successfully!", "success")
    
    # Create device session
    session_id = str(__import__('uuid').uuid4())[:8]
    from main import active_sessions
    active_sessions[session_id] = {
        "username": req.username,
        "device_name": "Web Browser",
        "ip_address": "127.0.0.1",
        "created_at": __import__('datetime').datetime.now().isoformat(),
        "last_active": __import__('datetime').datetime.now().isoformat(),
        "is_active": True
    }
    
    return {
        "message": "Login successful",
        "session_token": session_token,
        "session_id": session_id,
        "username": req.username
    }

@app.get("/quantum/test")
def test_quantum():
    return {"otp": quantum_rng.generate_otp(), "token": quantum_rng.generate_session_token()}

@app.get("/pqc/test")
def test_pqc():
    pub, priv = pqc.generate_keypair()
    return {"algorithm": "Kyber512", "public_key_length": len(pub)}

@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return {"users": [{"username": u.username, "email": u.email, "phone": u.phone} for u in users]}

@app.get("/login-history")
def get_login_history(db: Session = Depends(get_db)):
    history = db.query(LoginHistory).order_by(LoginHistory.timestamp.desc()).limit(50).all()
    return {"history": [{"username": h.username, "success": h.success, "timestamp": str(h.timestamp), "failure_reason": h.failure_reason} for h in history]}

# ========== BACKUP CODES ENDPOINTS ==========
from backup_codes import backup_manager

@app.post("/generate-backup-codes")
async def generate_backup_codes(username: str, db: Session = Depends(get_db)):
    """Generate new backup codes for user"""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    codes = backup_manager.generate_backup_codes(username)
    return {
        "message": "Backup codes generated successfully",
        "codes": codes,
        "warning": "Save these codes securely. They will not be shown again!"
    }

@app.post("/verify-backup-code")
async def verify_backup_code(username: str, code: str):
    """Verify a backup code during 2FA"""
    valid = backup_manager.verify_backup_code(username, code)
    if valid:
        return {"valid": True, "message": "Backup code verified"}
    else:
        raise HTTPException(status_code=401, detail="Invalid or used backup code")

@app.get("/backup-codes-status")
async def get_backup_codes_status(username: str):
    """Get remaining backup codes count"""
    remaining = backup_manager.get_remaining_codes_count(username)
    return {"remaining": remaining, "total": 8}

# ========== DEVICE MANAGEMENT ==========
from datetime import datetime, timedelta
import uuid

# Store active sessions (in production, use Redis)
active_sessions = {}

@app.post("/create-session")
async def create_session(username: str, device_name: str = "Unknown Device"):
    """Create a new session for a user"""
    session_id = str(uuid.uuid4())[:8]
    active_sessions[session_id] = {
        "username": username,
        "device_name": device_name,
        "ip_address": "127.0.0.1",  # In production, get from request
        "created_at": datetime.now().isoformat(),
        "last_active": datetime.now().isoformat(),
        "is_active": True
    }
    return {"session_id": session_id}

@app.get("/active-sessions")
async def get_active_sessions(username: str):
    """Get all active sessions for a user"""
    user_sessions = []
    for sid, session in active_sessions.items():
        if session["username"] == username and session["is_active"]:
            user_sessions.append({
                "session_id": sid,
                "device_name": session["device_name"],
                "ip_address": session["ip_address"],
                "created_at": session["created_at"],
                "last_active": session["last_active"]
            })
    return {"sessions": user_sessions, "total": len(user_sessions)}

@app.post("/revoke-session")
async def revoke_session(session_id: str):
    """Revoke a specific session"""
    if session_id in active_sessions:
        active_sessions[session_id]["is_active"] = False
        return {"message": "Session revoked successfully"}
    return {"error": "Session not found"}

@app.post("/revoke-all-sessions")
async def revoke_all_sessions(username: str):
    """Revoke all sessions except current"""
    revoked_count = 0
    for sid, session in active_sessions.items():
        if session["username"] == username and session["is_active"]:
            session["is_active"] = False
            revoked_count += 1
    return {"message": f"Revoked {revoked_count} sessions"}

# Update the verify-2fa endpoint to create a session
# Find the existing @app.post("/verify-2fa") and replace the return section

# ========== ACTIVE SESSIONS TRACKING ==========
# Add this at the top with other imports
# Import uuid at the top if not already there

# Store active sessions (in production, use Redis)
active_sessions = {}

@app.post("/api/create-session")
async def api_create_session(username: str, device_name: str = "Web Browser", ip: str = "127.0.0.1"):
    """Create a new session for tracking"""
    import uuid
    session_id = str(uuid.uuid4())[:8]
    active_sessions[session_id] = {
        "username": username,
        "device_name": device_name,
        "ip_address": ip,
        "created_at": datetime.now().isoformat(),
        "last_active": datetime.now().isoformat(),
        "is_active": True
    }
    return {"session_id": session_id}

@app.get("/api/active-sessions")
async def get_api_active_sessions(username: str):
    """Get all active sessions for a user"""
    user_sessions = []
    for sid, session in active_sessions.items():
        if session.get("username") == username and session.get("is_active", True):
            user_sessions.append({
                "session_id": sid,
                "device_name": session.get("device_name", "Unknown Device"),
                "ip_address": session.get("ip_address", "Unknown"),
                "created_at": session.get("created_at"),
                "last_active": session.get("last_active"),
                "is_current": False
            })
    return {"sessions": user_sessions, "total": len(user_sessions)}

@app.post("/api/revoke-session")
async def api_revoke_session(session_id: str):
    """Revoke a specific session"""
    if session_id in active_sessions:
        active_sessions[session_id]["is_active"] = False
        return {"message": "Session revoked successfully"}
    return {"error": "Session not found"}

# Add some demo sessions for testing
# Add this after the active_sessions initialization

# Demo sessions (for testing)
demo_sessions = [
    {"username": "arjun123", "device_name": "Chrome on MacBook Pro", "ip": "192.168.1.100", "current": True},
    {"username": "arjun123", "device_name": "Safari on iPhone 15", "ip": "192.168.1.101", "current": False},
    {"username": "arjun123", "device_name": "Firefox on Windows PC", "ip": "10.0.0.25", "current": False},
]

for sess in demo_sessions:
    import uuid
    session_id = str(uuid.uuid4())[:8]
    active_sessions[session_id] = {
        "username": sess["username"],
        "device_name": sess["device_name"],
        "ip_address": sess["ip"],
        "created_at": datetime.now().isoformat(),
        "last_active": datetime.now().isoformat(),
        "is_active": True
    }
print(f"✅ Added {len(demo_sessions)} demo sessions for testing")
