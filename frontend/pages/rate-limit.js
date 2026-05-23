import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function RateLimitStatus() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUsername(storedUser);
    fetchStatus();
  }, [router]);

  const fetchStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8000/rate-limit-status');
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⚛️ Rate Limit Status</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ Rate Limit Status</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Welcome, <span style={{color: '#60a5fa'}}>{username}</span>!</p>
        
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>🛡️ Security Rate Limits</h3>
          <p style={styles.infoText}>These limits prevent brute force and DoS attacks</p>
        </div>
        
        <div style={styles.limitsGrid}>
          <div style={styles.limitCard}>
            <span style={styles.limitIcon}>📝</span>
            <span style={styles.limitName}>Register</span>
            <span style={styles.limitValue}>5 attempts/minute</span>
          </div>
          
          <div style={styles.limitCard}>
            <span style={styles.limitIcon}>🔐</span>
            <span style={styles.limitName}>Login</span>
            <span style={styles.limitValue}>10 attempts/minute</span>
          </div>
          
          <div style={styles.limitCard}>
            <span style={styles.limitIcon}>⚛️</span>
            <span style={styles.limitName}>2FA Verification</span>
            <span style={styles.limitValue}>5 attempts/minute</span>
          </div>
          
          <div style={styles.limitCard}>
            <span style={styles.limitIcon}>📧</span>
            <span style={styles.limitName}>Forgot Password</span>
            <span style={styles.limitValue}>3 attempts/hour</span>
          </div>
          
          <div style={styles.limitCard}>
            <span style={styles.limitIcon}>🔑</span>
            <span style={styles.limitName}>Reset Password</span>
            <span style={styles.limitValue}>5 attempts/minute</span>
          </div>
        </div>
        
        <div style={styles.securityBox}>
          <h3 style={styles.securityTitle}>🔒 Additional Security Measures</h3>
          <ul style={styles.securityList}>
            <li>✅ Kyber512 Post-Quantum Cryptography</li>
            <li>✅ Quantum OTP 2-Factor Authentication</li>
            <li>✅ Rate Limiting on all auth endpoints</li>
            <li>✅ Password hashing with SHA3-256</li>
            <li>✅ Session tokens from quantum entropy</li>
            <li>✅ Login history tracking</li>
            <li>✅ Password reset with expiring tokens</li>
          </ul>
        </div>
        
        <div style={styles.navButtons}>
          <button onClick={() => router.push('/dashboard')} style={styles.navButton}>
            ← Back to Dashboard
          </button>
        </div>
        
        <div style={styles.footer}>
          <p>🔒 Rate limiting active on all authentication endpoints</p>
        </div>
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
    fontFamily: 'system-ui, sans-serif',
    padding: '1rem'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2rem',
    borderRadius: '1rem',
    width: '100%',
    maxWidth: '800px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0
  },
  logoutBtn: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: '1.5rem'
  },
  infoBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  infoTitle: {
    color: '#60a5fa',
    marginBottom: '0.5rem'
  },
  infoText: {
    color: '#94a3b8',
    fontSize: '0.875rem'
  },
  limitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  limitCard: {
    backgroundColor: '#334155',
    padding: '1rem',
    borderRadius: '0.75rem',
    textAlign: 'center'
  },
  limitIcon: {
    fontSize: '1.5rem',
    display: 'block',
    marginBottom: '0.5rem'
  },
  limitName: {
    color: '#ffffff',
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '0.25rem'
  },
  limitValue: {
    color: '#86efac',
    fontSize: '0.875rem',
    display: 'block'
  },
  securityBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem'
  },
  securityTitle: {
    color: '#60a5fa',
    marginBottom: '0.75rem'
  },
  securityList: {
    color: '#cbd5e1',
    fontSize: '0.875rem',
    margin: 0,
    paddingLeft: '1.25rem'
  },
  navButtons: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  navButton: {
    backgroundColor: '#334155',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  footer: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '0.7rem',
    marginTop: '1rem'
  }
};
