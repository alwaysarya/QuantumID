import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function DeviceManagement() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    fetchSessions(storedUser);
  }, [router]);

  const fetchSessions = async (user) => {
    try {
      const response = await axios.get(`http://localhost:8000/active-sessions?username=${user}`);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId) => {
    try {
      await axios.post(`http://localhost:8000/revoke-session?session_id=${sessionId}`);
      setMessage('✅ Session revoked successfully');
      fetchSessions(username);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to revoke session');
    }
  };

  const revokeAllSessions = async () => {
    if (confirm('Are you sure? This will log you out from all other devices.')) {
      try {
        await axios.post(`http://localhost:8000/revoke-all-sessions?username=${username}`);
        setMessage('✅ All sessions revoked');
        fetchSessions(username);
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Failed to revoke sessions');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    router.push('/login');
  };

  const getDeviceIcon = (deviceName) => {
    if (deviceName.toLowerCase().includes('chrome')) return '🌐';
    if (deviceName.toLowerCase().includes('firefox')) return '🦊';
    if (deviceName.toLowerCase().includes('safari')) return '🧭';
    if (deviceName.toLowerCase().includes('mobile')) return '📱';
    return '💻';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⚛️ Device Management</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ Device Management</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Welcome, <span style={{color: '#60a5fa'}}>{username}</span>!</p>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            🔐 Manage all devices where you're logged in. Revoke access for any device you don't recognize.
          </p>
        </div>
        
        <div style={styles.actionsBox}>
          <button onClick={revokeAllSessions} style={styles.revokeAllBtn}>
            🔒 Revoke All Other Sessions
          </button>
        </div>
        
        <div style={styles.sessionsBox}>
          <h3 style={styles.sessionsTitle}>📱 Active Sessions ({sessions.length})</h3>
          
          {sessions.length === 0 ? (
            <p style={styles.noSessions}>No active sessions found</p>
          ) : (
            <div style={styles.sessionsList}>
              {sessions.map((session) => (
                <div key={session.session_id} style={styles.sessionCard}>
                  <div style={styles.sessionIcon}>
                    {getDeviceIcon(session.device_name)}
                  </div>
                  <div style={styles.sessionInfo}>
                    <div style={styles.sessionDevice}>
                      <strong>{session.device_name}</strong>
                      {session.session_id === localStorage.getItem('session_token') && (
                        <span style={styles.currentBadge}>Current Device</span>
                      )}
                    </div>
                    <div style={styles.sessionDetails}>
                      <span>IP: {session.ip_address}</span>
                      <span>Logged in: {new Date(session.created_at).toLocaleString()}</span>
                      <span>Last active: {new Date(session.last_active).toLocaleString()}</span>
                    </div>
                  </div>
                  {session.session_id !== localStorage.getItem('session_token') && (
                    <button 
                      onClick={() => revokeSession(session.session_id)}
                      style={styles.revokeBtn}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {message && <p style={styles.message}>{message}</p>}
        
        <div style={styles.navButtons}>
          <button onClick={() => router.push('/dashboard')} style={styles.navButton}>
            ← Back to Dashboard
          </button>
        </div>
        
        <div style={styles.footer}>
          <p>🔒 Protected by Kyber512 Post-Quantum Cryptography</p>
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
    maxWidth: '900px'
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
    backgroundColor: '#1e1b4b',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  infoText: {
    color: '#a78bfa',
    fontSize: '0.875rem',
    margin: 0
  },
  actionsBox: {
    marginBottom: '1.5rem'
  },
  revokeAllBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  sessionsBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  sessionsTitle: {
    color: '#60a5fa',
    marginBottom: '1rem'
  },
  noSessions: {
    color: '#64748b',
    textAlign: 'center',
    padding: '2rem'
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  sessionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#1e293b',
    borderRadius: '0.5rem',
    border: '1px solid #334155'
  },
  sessionIcon: {
    fontSize: '2rem',
    minWidth: '50px',
    textAlign: 'center'
  },
  sessionInfo: {
    flex: 1
  },
  sessionDevice: {
    color: '#ffffff',
    marginBottom: '0.25rem',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center'
  },
  currentBadge: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '0.2rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem'
  },
  sessionDetails: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.7rem',
    color: '#94a3b8'
  },
  revokeBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.75rem'
  },
  message: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#064e3b',
    color: '#86efac',
    borderRadius: '0.5rem'
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
