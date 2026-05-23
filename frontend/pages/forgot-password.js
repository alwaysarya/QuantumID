import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState('request');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleRequestReset = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/forgot-password', { email });
      setMessage(`✅ ${response.data.message}`);
      if (response.data.reset_token) {
        setResetToken(response.data.reset_token);
        setStep('reset');
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Request failed'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/reset-password', {
        token: resetToken,
        new_password: newPassword
      });
      setMessage(`✅ ${response.data.message}`);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Reset failed'}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'reset') {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⚛️ Reset Password</h1>
          <p style={styles.subtitle}>Enter your new password</p>
          
          <div style={styles.tokenBox}>
            <p style={styles.tokenLabel}>Your reset token:</p>
            <p style={styles.tokenValue}>{resetToken}</p>
            <p style={styles.tokenNote}>Copy this token (in production, emailed to you)</p>
          </div>
          
          <input 
            type="password" 
            placeholder="New Password" 
            style={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            style={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button 
            onClick={handleResetPassword}
            disabled={loading}
            style={styles.button}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          
          {message && <p style={message.includes('✅') ? styles.successMsg : styles.errorMsg}>{message}</p>}
          
          <button onClick={() => setStep('request')} style={styles.backBtn}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚛️ Forgot Password</h1>
        <p style={styles.subtitle}>Enter your email to reset password</p>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button 
          onClick={handleRequestReset}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        
        {message && <p style={message.includes('✅') ? styles.successMsg : styles.errorMsg}>{message}</p>}
        
        <p style={styles.link}>
          <Link href="/login" style={{ color: '#60a5fa' }}>← Back to Login</Link>
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
  backBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#475569',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginTop: '0.5rem'
  },
  tokenBox: {
    backgroundColor: '#1e1b4b',
    padding: '1rem',
    borderRadius: '0.5rem',
    textAlign: 'center',
    marginBottom: '1rem'
  },
  tokenLabel: {
    color: '#a78bfa',
    fontSize: '0.875rem',
    marginBottom: '0.5rem'
  },
  tokenValue: {
    color: '#ffffff',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    wordBreak: 'break-all'
  },
  tokenNote: {
    color: '#fbbf24',
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
  link: {
    textAlign: 'center',
    marginTop: '1rem'
  }
};
