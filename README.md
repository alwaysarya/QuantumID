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
  <img src="https://img.shields.io/badge/Status-Production%20Ready-22C55E?style=flat-square"/>
</p>

<p>
  <strong>Quantum-safe authentication for the post-RSA era.</strong><br/>
  Built for <a href="#">QuantumX Hackathon 2026</a> · Powered by NIST-approved PQC + Qiskit Quantum RNG
</p>

<a href="#-installation">Get Started</a> ·
<a href="#-api-endpoints">API Docs</a> ·
<a href="#-architecture">Architecture</a> ·
<a href="#-deployment">Deploy</a>

</div>

---

## 🎯 Overview

Quantum computers running Shor's algorithm will render RSA and ECC encryption obsolete within this decade. **QuantumID** is a production-ready authentication system designed to survive that transition today.

It combines **NIST-approved Kyber512** (post-quantum lattice cryptography) with **true Quantum Random Number Generation** via IBM Qiskit — delivering an end-to-end identity stack that is provably secure against both classical and quantum adversaries.

| Metric | Value |
|--------|-------|
| 🔒 PQC Algorithm | Kyber512 (NIST PQC Standard) |
| 🎲 Entropy Source | True Quantum (Hadamard Gate Circuits) |
| 🔑 2FA Method | Quantum OTP via SMS & Email |
| 🛡️ Password Hashing | SHA3-256 (Quantum-safe) |
| ⚡ API Response Time | < 1 second |
| 📦 Database | SQLite (PostgreSQL-ready) |

---

## ✨ Features

### 🔐 Core Security
| Feature | Description |
|---------|-------------|
| **Kyber512 PQC** | NIST-standardized lattice-based key encapsulation — resistant to quantum attacks |
| **Quantum RNG** | True randomness generated from Qiskit Hadamard gate circuits, not pseudo-RNG |
| **SHA3-256 Hashing** | Quantum-resistant password storage with no legacy MD5/SHA1 fallback |
| **Quantum OTP 2FA** | One-time passwords seeded with quantum entropy for every login |

### 👤 User Features
| Feature | Description |
|---------|-------------|
| **Secure Registration** | Creates Kyber512 keypairs on account creation |
| **2FA Login Flow** | Two-step: password verification → Quantum OTP delivery and confirmation |
| **Security Dashboard** | Real-time session info, active device count, and security metrics |
| **Profile Management** | Update email, phone, and notification preferences |
| **2FA Backup Codes** | 8 one-time recovery codes per user for account recovery |
| **Device Management** | View all active sessions and revoke them individually |

### 🛡️ Admin Features
| Feature | Description |
|---------|-------------|
| **Admin Panel** | Full view of all registered users and account statuses |
| **Login History** | Timestamped audit trail of every authentication attempt |
| **Rate Limiting** | Brute-force protection at 5–10 requests/minute per endpoint |
| **User Management** | Monitor system-wide activity and manage accounts |

### 📈 Advanced Features
| Feature | Description |
|---------|-------------|
| **Analytics Dashboard** | Login trends, success rates, and anomaly detection via Chart.js |
| **CSV Report Export** | Download filtered login history as structured reports |
| **Real-time WebSocket Alerts** | Instant push notifications to the live dashboard |
| **SMS Delivery** | OTP dispatched via TextBee gateway |
| **Email Delivery** | OTP dispatched via Brevo / SendGrid |
| **Quantum Entropy Visualizer** | Live frontend visualization of Qiskit quantum circuit outputs |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Role |
|------------|---------|------|
| **Python** | 3.11 | Core runtime |
| **FastAPI** | 0.104 | REST API + WebSocket server |
| **liboqs-python** | latest | Kyber512 post-quantum crypto |
| **Qiskit + Qiskit Aer** | 0.45 | Quantum RNG (Hadamard circuits) |
| **SQLAlchemy** | latest | ORM for SQLite / PostgreSQL |
| **Uvicorn** | latest | ASGI production server |

### Frontend
| Technology | Version | Role |
|------------|---------|------|
| **Next.js** | 14.0 | React framework with SSR |
| **Chart.js + react-chartjs-2** | latest | Analytics and visualization |
| **Axios** | latest | HTTP client for API calls |
| **CSS-in-JS** | — | Component-scoped styling |

### Integrations
| Service | Purpose |
|---------|---------|
| **TextBee** | SMS OTP delivery |
| **Brevo / SendGrid** | Email OTP delivery |
| **Docker** | Container-based deployment |
| **Render.com** | Backend cloud hosting |
| **Vercel** | Frontend CDN deployment |

---

## 🏗️ Architecture

### System Overview

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        A["Next.js Frontend\nPort 3000"]
    end

    subgraph API["⚙️ API Layer"]
        B["FastAPI Backend\nPort 8000"]
        C["WebSocket Server\n/ws/{client_id}"]
    end

    subgraph Security["🔐 Security Layer"]
        D["Kyber512 PQC\nKey Encapsulation"]
        E["Quantum RNG\nQiskit Hadamard Circuits"]
        F["SHA3-256\nPassword Hashing"]
    end

    subgraph Data["🗄️ Data Layer"]
        G[("SQLite / PostgreSQL\nUser & Session Store")]
        H["Session Store\nIn-memory / Redis"]
    end

    subgraph Alerts["📣 Alert Layer"]
        I["SMS Gateway\nTextBee"]
        J["Email Gateway\nBrevo / SendGrid"]
    end

    A -->|REST| B
    A <-->|WebSocket| C
    B --> D
    B --> E
    B --> F
    B --> G
    B --> H
    B --> I
    B --> J
    C --> B
```

### Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Next.js Frontend
    participant API as FastAPI Backend
    participant QC as Qiskit Quantum RNG
    participant PQC as Kyber512 (liboqs)
    participant DB as SQLite / PostgreSQL
    participant OTP as SMS / Email Gateway

    User->>FE: Submit registration form
    FE->>API: POST /register
    API->>PQC: Generate Kyber512 keypair
    PQC-->>API: public_key, private_key
    API->>DB: Store user + SHA3-256 hashed password + public_key
    API-->>FE: 201 Created

    User->>FE: Submit login credentials
    FE->>API: POST /login
    API->>DB: Verify SHA3-256 password hash
    API->>QC: Generate quantum-entropy OTP
    QC-->>API: Random bits (Hadamard circuit)
    API->>OTP: Dispatch OTP via SMS/Email
    API-->>FE: 200 OK — awaiting 2FA

    User->>FE: Submit OTP code
    FE->>API: POST /verify-2fa
    API->>DB: Validate OTP + expiry
    API-->>FE: JWT session token
    FE-->>User: Authenticated — Dashboard
```

### Database Schema

```mermaid
erDiagram
    USERS {
        int id PK
        string username
        string email
        string phone
        string password_hash
        string public_key
        string private_key_enc
        datetime created_at
        bool is_admin
    }
    SESSIONS {
        int id PK
        int user_id FK
        string session_token
        string device_info
        datetime created_at
        datetime expires_at
        bool is_active
    }
    LOGIN_HISTORY {
        int id PK
        int user_id FK
        datetime timestamp
        string ip_address
        string status
        string method
    }
    BACKUP_CODES {
        int id PK
        int user_id FK
        string code_hash
        bool used
        datetime created_at
    }
    OTP_STORE {
        int id PK
        int user_id FK
        string otp_hash
        datetime expires_at
        bool verified
    }

    USERS ||--o{ SESSIONS : "has"
    USERS ||--o{ LOGIN_HISTORY : "generates"
    USERS ||--o{ BACKUP_CODES : "owns"
    USERS ||--o{ OTP_STORE : "receives"
```

### Component Architecture

```mermaid
graph LR
    subgraph Frontend["Frontend (Next.js 14)"]
        P1[index.js\nLanding]
        P2[login.js\n2FA Flow]
        P3[register.js]
        P4[dashboard.js]
        P5[analytics.js]
        P6[profile.js]
        P7[devices.js]
        P8[backup-codes.js]
        P9[admin.js]
        P10[history.js]
        P11[entropy.js\nQuantum Viz]
        C1[WebSocketAlerts.js]
        C2[ExportReports.js]
    end

    subgraph Backend["Backend (FastAPI)"]
        M[main.py\nEntry Point]
        DB[database.py\nSQLAlchemy Models]
        SMS[sms_service.py\nTextBee]
        EMAIL[email_service.py\nBrevo]
        WS[websocket_manager.py]
        BC[backup_codes.py]
    end

    P4 --> C1
    P5 --> C2
    Frontend -->|HTTP + WS| Backend
```

---

## 📁 Folder Structure

```
quantumid/
├── backend/
│   ├── main.py                 # FastAPI app, all route definitions
│   ├── database.py             # SQLAlchemy ORM models
│   ├── sms_service.py          # TextBee SMS integration
│   ├── email_service.py        # Brevo / SendGrid email integration
│   ├── websocket_manager.py    # WebSocket connection management
│   └── backup_codes.py         # 2FA backup code generation & validation
│
├── frontend/
│   ├── pages/
│   │   ├── index.js            # Public landing page
│   │   ├── login.js            # Login + 2FA verification flow
│   │   ├── register.js         # New user registration
│   │   ├── dashboard.js        # Authenticated user home
│   │   ├── analytics.js        # Login trends & anomaly charts
│   │   ├── profile.js          # User settings & preferences
│   │   ├── devices.js          # Active session management
│   │   ├── backup-codes.js     # 2FA recovery code management
│   │   ├── admin.js            # Admin user overview panel
│   │   ├── history.js          # Full authentication audit log
│   │   └── entropy.js          # Quantum entropy live visualizer
│   │
│   └── components/
│       ├── WebSocketAlerts.js  # Real-time push notification component
│       └── ExportReports.js    # CSV report download component
│
├── ml_pipeline/                # ML anomaly detection (optional/future)
├── requirements.txt
├── .env.example
└── README.md
```

---

## 🚀 Installation

### Prerequisites

| Requirement | Minimum Version |
|-------------|----------------|
| Python | 3.11+ |
| Node.js | 18+ |
| npm | 9+ |
| pip | 23+ |

### Step 1 — Clone the Repository

```bash
git clone https://github.com/alwaysarya/quantumid.git
cd quantumid
```

### Step 2 — Backend Setup

```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install all dependencies
pip install -r requirements.txt

# Install core quantum/PQC packages
pip install liboqs-python qiskit qiskit-aer fastapi uvicorn
```

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm install chart.js react-chartjs-2
```

### Step 4 — Environment Configuration

```bash
cp .env.example .env
# Open .env and fill in your API keys (see Environment Variables below)
```

### Step 5 — Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
source ../venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> 💡 The backend API is available at [http://localhost:8000](http://localhost:8000), with interactive Swagger docs at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🔐 Environment Variables

Create a `.env` file in the project root. All variables below are required unless marked optional.

```env
# ── TextBee SMS ─────────────────────────────────────────────────
TEXTBEE_API_KEY=your_textbee_api_key
TEXTBEE_DEVICE_ID=your_device_id

# ── Brevo / SendGrid Email ──────────────────────────────────────
BREVO_API_KEY=your_brevo_api_key
FROM_EMAIL=noreply@yourdomain.com

# ── Security ────────────────────────────────────────────────────
SECRET_KEY=your_secret_key_min_32_chars
JWT_SECRET=your_jwt_secret_min_32_chars

# ── Database (optional — defaults to SQLite) ────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/quantumid
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `POST` | `/register` | Register new user, generates Kyber512 keypair | ❌ |
| `POST` | `/login` | Verify password, dispatch Quantum OTP | ❌ |
| `POST` | `/verify-2fa` | Confirm OTP, receive JWT session token | ❌ |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/active-sessions` | List active sessions for current user | ✅ |
| `POST` | `/revoke-session` | Revoke a specific device session | ✅ |
| `POST` | `/generate-backup-codes` | Generate 8 one-time 2FA recovery codes | ✅ |
| `GET` | `/backup-codes-status` | Check number of remaining backup codes | ✅ |

### Admin
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/users` | List all registered users | ✅ Admin |
| `GET` | `/login-history` | Full authentication audit log | ✅ Admin |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/quantum/test` | Run test Qiskit Hadamard circuit, return random bits | ❌ |
| `GET` | `/pqc/test` | Test Kyber512 key encapsulation/decapsulation | ❌ |
| `WS` | `/ws/{client_id}` | WebSocket channel for real-time dashboard alerts | ✅ |

---

## 🖼️ Screenshots

> _Screenshots coming soon. Run the app locally to explore the UI._

| Page | Description |
|------|-------------|
| `/ ` | Public landing page with feature overview |
| `/login` | Two-step login: password → Quantum OTP |
| `/dashboard` | Live security metrics and session info |
| `/analytics` | Login trends, success rates, anomaly charts |
| `/entropy` | Real-time Qiskit quantum entropy visualizer |
| `/admin` | Admin panel with user and history views |

---

## ☁️ Deployment

### Backend — Render.com

```yaml
# render.yaml
services:
  - type: web
    name: quantumid-backend
    runtime: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port 8000
    envVars:
      - key: TEXTBEE_API_KEY
        sync: false
      - key: BREVO_API_KEY
        sync: false
      - key: JWT_SECRET
        sync: false
```

### Frontend — Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Set `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com` in Vercel environment settings.

### Docker

```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
# Build and run
docker build -t quantumid-backend .
docker run -p 8000:8000 --env-file .env quantumid-backend
```

---

## 🔮 Future Improvements

- **PostgreSQL** — Production-grade persistent storage with connection pooling
- **OAuth 2.0** — Google and GitHub social login support
- **React Native App** — Mobile companion with biometric unlock
- **WebAuthn / Passkeys** — Passwordless authentication via FIDO2
- **Blockchain Audit Log** — Immutable, tamper-proof authentication records
- **LSTM Anomaly Detection** — ML-based fraud and impossible travel detection
- **Social Recovery** — Multi-factor account recovery via trusted contacts
- **Redis Session Store** — High-performance, distributed session management

---

## 👥 Contributors

| Name | Role | GitHub |
|------|------|--------|
| **Arya Ranjan** | Full-Stack Developer | [@alwaysarya](https://github.com/alwaysarya) |

> Built for **QuantumX Hackathon 2026**. Contributions and pull requests are welcome!

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ⚛️ and 🔐 for a post-quantum world

<a href="https://github.com/alwaysarya/quantumid">⭐ Star this repo</a> · <a href="https://github.com/alwaysarya/quantumid/issues">🐛 Report a Bug</a> · <a href="https://github.com/alwaysarya/quantumid/issues">💡 Request a Feature</a>

</div>
