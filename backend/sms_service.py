"""
TextBee SMS Service for QuantumID
"""

import requests
from datetime import datetime

class SMSService:
    def __init__(self):
        self.api_key = "967240c9-6fe3-48b9-987c-539ad6a6b161"
        self.device_id = "69fa6641b5cd3ce4c7f36f80"
        self.base_url = "https://api.textbee.dev/api/v1/gateway"
    
    def send_otp(self, phone_number: str, otp: str) -> bool:
        try:
            url = f"{self.base_url}/devices/{self.device_id}/send-sms"
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json"
            }
            message = f"🔐 Your QuantumID OTP is: {otp}. Valid for 5 minutes."
            
            data = {
                "recipients": [phone_number],
                "message": message
            }
            response = requests.post(url, json=data, headers=headers, timeout=10)
            print(f"SMS sent: {response.status_code}")
            return response.status_code == 200
        except Exception as e:
            print(f"SMS error: {e}")
            return False

sms_service = SMSService()
