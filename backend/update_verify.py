# Run this to update verify-2fa endpoint
import re

with open('main.py', 'r') as f:
    content = f.read()

# Find and replace the verify-2fa return section
old_return = '''    return {
        "message": "Login successful",
        "session_token": session_token,
        "username": req.username
    }'''

new_return = '''    # Create device session
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
    }'''

if old_return in content:
    content = content.replace(old_return, new_return)
    with open('main.py', 'w') as f:
        f.write(content)
    print("✅ Updated verify-2fa endpoint")
else:
    print("⚠️ Could not find the exact text to replace")
