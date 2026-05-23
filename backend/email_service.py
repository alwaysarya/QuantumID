"""
Email Service for QuantumID
"""

class EmailService:
    def __init__(self):
        pass
    
    def send_otp_email(self, to_email: str, username: str, otp: str) -> bool:
        print(f"📧 [SIMULATED] Email would be sent to {to_email} with OTP: {otp}")
        return False

email_service = EmailService()
