"""
2FA Backup Codes for QuantumID
"""

import secrets
import hashlib
from database import get_db, User
from sqlalchemy.orm import Session

class BackupCodeManager:
    def __init__(self):
        self.codes_store = {}  # In production, store in database
    
    def generate_backup_codes(self, username: str, count: int = 8) -> list:
        """Generate one-time backup codes for user"""
        codes = []
        for _ in range(count):
            # Generate 8-character alphanumeric code
            code = secrets.token_hex(4).upper()
            codes.append(code)
        
        # Store hashed codes (in production, store in DB)
        hashed_codes = [hashlib.sha256(code.encode()).hexdigest() for code in codes]
        self.codes_store[username] = {
            "codes": hashed_codes,
            "used": [False] * count
        }
        
        return codes
    
    def verify_backup_code(self, username: str, code: str) -> bool:
        """Verify and consume a backup code"""
        if username not in self.codes_store:
            return False
        
        stored = self.codes_store[username]
        hashed_input = hashlib.sha256(code.encode()).hexdigest()
        
        for i, stored_hash in enumerate(stored["codes"]):
            if stored_hash == hashed_input and not stored["used"][i]:
                stored["used"][i] = True
                return True
        
        return False
    
    def get_remaining_codes_count(self, username: str) -> int:
        """Get number of unused backup codes"""
        if username not in self.codes_store:
            return 0
        return sum(1 for used in self.codes_store[username]["used"] if not used)

backup_manager = BackupCodeManager()
