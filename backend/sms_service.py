"""TextBee SMS Service for QuantumID.

This module reads credentials from environment variables. In development the
service will be a no-op if credentials are not provided.
"""

import os
import requests
from datetime import datetime


class SMSService:
    def __init__(self):
        # Read credentials from environment for safety
        self.api_key = os.getenv("TEXTBEE_API_KEY", "")
        self.device_id = os.getenv("TEXTBEE_DEVICE_ID", "")
        self.base_url = os.getenv("TEXTBEE_BASE_URL", "https://api.textbee.dev/api/v1/gateway")

        if not self.api_key or not self.device_id:
            print("⚠️ SMSService: TEXTBEE_API_KEY or TEXTBEE_DEVICE_ID not set. SMS sending disabled.")

    def send_otp(self, phone_number: str, otp: str) -> bool:
        """Send an OTP via TextBee. Returns True on success.

        If credentials are missing this function returns False and logs a warning.
        """
        if not self.api_key or not self.device_id:
            print("SMSService: Missing credentials; skipping SMS send (dev).")
            return False

        try:
            url = f"{self.base_url}/devices/{self.device_id}/send-sms"
            headers = {
                "x-api-key": self.api_key,
                "Content-Type": "application/json",
            }
            message = f"🔐 Your QuantumID OTP is: {otp}. Valid for 5 minutes."

            data = {
                "recipients": [phone_number],
                "message": message,
            }
            response = requests.post(url, json=data, headers=headers, timeout=10)
            print(f"SMS sent: {response.status_code}")
            return response.status_code == 200
        except Exception as e:
            print(f"SMS error: {e}")
            return False


sms_service = SMSService()
