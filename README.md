markdown
# ⚛️ QuantumID

[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg)](https://nextjs.org)
[![Qiskit](https://img.shields.io/badge/Qiskit-0.45-purple.svg)](https://qiskit.org)
[![Kyber512](https://img.shields.io/badge/PQC-Kyber512-orange.svg)](https://pq-crystals.org/kyber/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Post-Quantum Secure Digital Identity System** | QuantumX Hackathon 2026

QuantumID is a production-ready authentication system that combines **NIST-approved Post-Quantum Cryptography (Kyber512)** with **Quantum Random Number Generation (Qiskit)** to protect digital identities against future quantum computer attacks.

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🎯 Overview

**The Problem:** Quantum computers will break RSA and ECC encryption by 2030, compromising every digital identity system in existence.

**The Solution:** QuantumID implements **Kyber512** (NIST-approved post-quantum cryptography) and **Quantum Random Number Generation** to create a future-proof authentication system.

<div align="center">

<img src="https://img.shields.io/badge/⚛️-QuantumID-6C3FCF?style=for-the-badge&labelColor=0D0D0D" alt="QuantumID" height="60"/>

# QuantumID

### Post-Quantum Secure Digital Identity System

<p>
    <a href="https://python.org"><img src="https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white"/></a>
    <a href="https://fastapi.tiangolo.com"><img src="https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi&logoColor=white"/></a>
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-14.0-000000?style=flat-square&logo=next.js&logoColor=white"/></a>
    <a href="https://qiskit.org"><img src="https://img.shields.io/badge/Qiskit-0.45-6929C4?style=flat-square&logo=ibm&logoColor=white"/></a>
    <a href="https://pq-crystals.org/kyber/"><img src="https://img.shields.io/badge/PQC-Kyber512-FF6B35?style=flat-square"/></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-22C55E?style=flat-square"/></a>
</p>

<p>
    <strong>Quantum-safe authentication for the post‑RSA era.</strong><br/>
    Prototype built with Kyber512 PQC + Qiskit RNG · Demo SMS & WebSocket integrations
</p>

<a href="#getting-started">Get Started</a> ·
<a href="#api-reference-summary">API Docs</a> ·
<a href="#architecture">Architecture</a> ·
<a href="#deployment">Deploy</a>

</div>

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Usage & flows](#usage--flows)
- [API reference (summary)](#api-reference-summary)
- [Frontend notes](#frontend-notes)
- [Security & production notes](#security--production-notes)
- [Contributing](#contributing)
- [License](#license)
### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | REST API framework |
| **Python 3.11** | Core language |
| **liboqs** | Post-Quantum Cryptography (Kyber512) |
| **Qiskit** | Quantum Random Number Generation |
| **SQLite** | Database (production-ready for PostgreSQL) |
| **WebSockets** | Real-time alerts |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework |
| **Chart.js** | Analytics visualizations |
| **Axios** | API client |
| **CSS-in-JS** | Styling |

### APIs & Integrations
| Service | Purpose |
|---------|---------|
| **TextBee** | SMS delivery |
| **Brevo/SendGrid** | Email delivery |

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Next.js Frontend<br/>Port 3000]
    end
    
    subgraph "API Layer"
        B[FastAPI Backend<br/>Port 8000]
        C[WebSocket Server<br/>/ws/{client_id}]
    end
    
    subgraph "Security Layer"
        D[Kyber512 PQC<br/>Key Encapsulation]
        E[Quantum RNG<br/>Qiskit Hadamard]
        F[SHA3-256<br/>Password Hashing]
    end
    
    subgraph "Data Layer"
        G[(SQLite/PostgreSQL)]
        H[Session Store<br/>In-memory/Redis]
    end
    
    subgraph "Alert Layer"
        I[SMS Gateway<br/>TextBee]
        J[Email Gateway<br/>Brevo]
    end
    
    A --> B
    A <--> C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    B --> J
Authentication Flow
📁 Folder Structure
text
quantumid/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # SQLAlchemy models
│   ├── sms_service.py       # TextBee SMS integration
│   ├── email_service.py     # Brevo email integration
│   ├── websocket_manager.py # WebSocket connections
│   └── backup_codes.py      # 2FA backup code logic
│
├── frontend/
│   ├── pages/
│   │   ├── index.js         # Landing page
│   │   ├── login.js         # Login + 2FA flow
│   │   ├── register.js      # User registration
│   │   ├── dashboard.js     # Main dashboard
│   │   ├── analytics.js     # Charts & graphs
│   │   ├── profile.js       # User profile
│   │   ├── devices.js       # Session management
│   │   ├── backup-codes.js  # 2FA recovery codes
│   │   ├── admin.js         # Admin panel
│   │   ├── history.js       # Login history
│   │   └── entropy.js       # Quantum entropy visualizer
│   │
│   └── components/
│       ├── WebSocketAlerts.js
│       └── ExportReports.js
│
├── ml_pipeline/             # ML models (optional)
├── requirements.txt
└── README.md
🚀 Installation
Prerequisites
Requirement	Version
Python	3.11+
Node.js	18+
npm	9+
pip	23+
Step 1: Clone the repository
bash
git clone https://github.com/alwaysarya/quantumid.git
cd quantumid
Step 2: Backend Setup
bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install additional packages
pip install liboqs-python qiskit qiskit-aer fastapi uvicorn
Step 3: Frontend Setup
bash
cd frontend
npm install
npm install chart.js react-chartjs-2
Step 4: Environment Configuration
bash
cp .env.example .env
# Edit .env with your API keys
Step 5: Run the Application
Terminal 1 - Backend:

bash
cd backend
uvicorn main:app --reload --port 8000
Terminal 2 - Frontend:

bash
cd frontend
npm install
npm run dev
Open Browser: http://localhost:3000

🔐 Environment Variables
env
# TextBee SMS Configuration
TEXTBEE_API_KEY=your_textbee_api_key
TEXTBEE_DEVICE_ID=your_device_id

# Brevo Email Configuration
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=sender@example.com

# Database (Optional - defaults to SQLite)
DATABASE_URL=postgresql://user:pass@localhost/quantumid

# Security
SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
📡 API Endpoints
Method	Endpoint	Description
POST	/register	Register new user with Kyber512 keypair
POST	/login	Authenticate and receive Quantum OTP
POST	/verify-2fa	Verify OTP and receive session token
GET	/users	List all users (admin)
GET	/login-history	View authentication attempts
GET	/quantum/test	Test Quantum RNG
GET	/pqc/test	Test Kyber512 PQC
GET	/active-sessions	Get active sessions for user
POST	/revoke-session	Revoke specific session
POST	/generate-backup-codes	Generate 2FA backup codes
GET	/backup-codes-status	Check remaining backup codes
WS	/ws/{client_id}	WebSocket for real-time alerts
☁️ Deployment
Deploy Backend (Render.com)
yaml
# render.yaml
services:
  - type: web
    name: quantumid-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port 8000
Deploy Frontend (Vercel)
bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
Docker Deployment
dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD uvicorn main:app --host 0.0.0.0 --port 8000
bash
docker build -t quantumid-backend .
docker run -p 8000:8000 quantumid-backend
🔮 Future Improvements
PostgreSQL Database - Production-grade persistent storage

OAuth Integration - Google/GitHub login support

Mobile App - React Native companion app

Biometric Authentication - WebAuthn/Passkeys

Blockchain Audit Log - Immutable authentication records

LSTM Anomaly Detection - ML-based fraud detection

Multi-factor Recovery - Social recovery for backup codes

👥 Contributors
Name	Role	GitHub
Arya Ranjan	Full-stack Developer	@alwaysarya
