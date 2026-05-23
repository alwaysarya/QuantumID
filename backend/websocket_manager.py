"""
WebSocket Manager for Real-time Alerts
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict
import json
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.user_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if user_id:
            self.user_connections[user_id] = websocket
        print(f"✅ WebSocket connected. Total: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket, user_id: str = None):
        self.active_connections.remove(websocket)
        if user_id and user_id in self.user_connections:
            del self.user_connections[user_id]
        print(f"❌ WebSocket disconnected. Total: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            await self.user_connections[user_id].send_json(message)
    
    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)
    
    async def send_alert(self, alert_type: str, message: str, severity: str = "info"):
        alert_data = {
            "type": alert_type,
            "message": message,
            "severity": severity,
            "timestamp": datetime.now().isoformat()
        }
        await self.broadcast(alert_data)

manager = ConnectionManager()
