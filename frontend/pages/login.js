import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('password');
  const [message, setMessage] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
      
      if (response.data.requires_2fa) {
        setStep('2fa');
        setGeneratedOtp(response.data.quantum_otp);
        setMessage(`✅ ${response.data.message}`);
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Login failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handle2FASubmit = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/verify-2fa', {
        username,
        otp
      });
      
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('session_token', response.data.session_token);
      
      setMessage(`✅ ${response.data.message}`);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Invalid OTP'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetLogin = () => {
    setStep('password');
    setUsername('');
    setPassword('');
    setOtp('');
    setMessage('');
    setGeneratedOtp('');
  };

  if (step === '2fa') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⚛️ 2FA Verification</h1>
          <p style={styles.subtitle}>Enter OTP to complete login</p>
          
          <div style={styles.otpBox}>
            <p style={styles.otpLabel}>🔐 Your Quantum OTP is:</p>
            <p style={styles.otpValue}>{generatedOtp}</p>
            <p style={styles.otpExpiry}>⏱️ Expires in 60 seconds</p>
            <p style={styles.otpNote}>In production, this would be sent via SMS/Email</p>
          </div>
          
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            style={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <button 
            onClick={handle2FASubmit}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          
          {message && <p style={message.includes('✅') ? styles.successMsg : styles.errorMsg}>{message}</p>}
          
          <button onClick={resetLogin} style={styles.resetBtn}>
            ← Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚛️ QuantumID</h1>
        <p style={styles.subtitle}>Post-Quantum Secure Login</p>
        
        <input 
          type="text" 
          placeholder="Username" 
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handlePasswordSubmit}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Authenticating...' : 'Login with Kyber512'}
        </button>
        
        {message && <p style={message.includes('✅') ? styles.successMsg : styles.errorMsg}>{message}</p>}
        
        <p style={styles.footer}>
          🔒 Kyber512 PQC | ⚛️ Quantum OTP | 📱 SMS 2FA Ready
        </p>
        <p style={styles.link}>
          <Link href="/register" style={{ color: '#60a5fa' }}>No account? Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2rem',
    borderRadius: '1rem',
    width: '450px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '1rem'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  resetBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#475569',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  otpBox: {
    backgroundColor: '#1e1b4b',
    padding: '1rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  otpLabel: {
    color: '#a78bfa',
    fontSize: '0.875rem',
    marginBottom: '0.5rem'
  },
  otpValue: {
    color: '#86efac',
    fontSize: '2rem',
    fontWeight: 'bold',
    letterSpacing: '0.3rem'
  },
  otpExpiry: {
    color: '#fbbf24',
    fontSize: '0.7rem',
    marginTop: '0.5rem'
  },
  otpNote: {
    color: '#94a3b8',
    fontSize: '0.7rem',
    marginTop: '0.5rem'
  },
  successMsg: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#064e3b',
    color: '#86efac',
    borderRadius: '0.5rem'
  },
  errorMsg: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    borderRadius: '0.5rem'
  },
  footer: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.7rem',
    marginTop: '1rem'
  },
  link: {
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  }
};
