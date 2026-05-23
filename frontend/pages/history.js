import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginHistory() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    fetchHistory();
  }, [router]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/login-history');
      setHistory(response.data.history);
    } catch (error) {
      console.error('Failed to fetch history:', error);
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
          <h1 style={styles.title}>⚛️ Login History</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ Login History</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Welcome, <span style={{color: '#60a5fa'}}>{username}</span>!</p>
        
        <div style={styles.statsBox}>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>Total Login Attempts:</strong> <span style={{color: '#86efac'}}>{history.length}</span></p>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>Successful Logins:</strong> <span style={{color: '#86efac'}}>{history.filter(h => h.success).length}</span></p>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>Failed Logins:</strong> <span style={{color: '#fca5a5'}}>{history.filter(h => !h.success).length}</span></p>
        </div>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Reason</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.td}>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td style={styles.td}>{entry.username}</td>
                  <td style={styles.td}>
                    {entry.success ? (
                      <span style={styles.successBadge}>✅ Success</span>
                    ) : (
                      <span style={styles.failedBadge}>❌ Failed</span>
                    )}
                  </td>
                  <td style={styles.td}>{entry.failure_reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
            <p style={styles.noData}>No login history yet. Try logging in!</p>
          )}
        </div>
        
        <div style={styles.navButtons}>
          <button onClick={() => router.push('/dashboard')} style={styles.navButton}>
            ← Back to Dashboard
          </button>
          <button onClick={() => router.push('/admin')} style={styles.navButton}>
            Admin Panel →
          </button>
        </div>
        
        <div style={styles.footer}>
          <p>🔒 All login attempts are logged with quantum-safe encryption</p>
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
    maxWidth: '1000px'
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
    marginBottom: '1rem'
  },
  statsBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem'
  },
  statsText: {
    color: '#cbd5e1',
    margin: '0.5rem 0'
  },
  tableContainer: {
    overflowX: 'auto',
    marginBottom: '1.5rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#0f172a',
    borderRadius: '0.5rem'
  },
  tableHeader: {
    backgroundColor: '#334155'
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left',
    color: '#ffffff',
    fontWeight: 'bold'
  },
  tableRow: {
    borderBottom: '1px solid #334155'
  },
  td: {
    padding: '0.75rem',
    color: '#cbd5e1'
  },
  successBadge: {
    backgroundColor: '#064e3b',
    color: '#86efac',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem'
  },
  failedBadge: {
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem'
  },
  noData: {
    textAlign: 'center',
    color: '#64748b',
    padding: '2rem'
  },
  navButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
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
