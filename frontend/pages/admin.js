import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('username');
    if (!loggedInUser) {
      router.push('/login');
      return;
    }
    
    if (loggedInUser === 'testuser') {
      setIsAdmin(true);
      fetchUsers();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
          <h1 style={styles.title}>⚛️ Admin Panel</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⛔ Access Denied</h1>
          <p style={styles.subtitle}>You don't have admin privileges.</p>
          <button onClick={() => router.push('/dashboard')} style={styles.button}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ Admin Panel</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Registered Users (<span style={{color: '#86efac'}}>{users.length}</span>)</p>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Username</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Registered On</th>
               </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>
                    {user.username}
                    {user.username === 'testuser' && <span style={styles.adminBadge}>Admin</span>}
                  </td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{new Date(user.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={styles.statsBox}>
          <h3 style={styles.statsTitle}>📊 System Statistics</h3>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>Total Users:</strong> <span style={{color: '#86efac'}}>{users.length}</span></p>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>PQC Algorithm:</strong> <span style={{color: '#60a5fa'}}>Kyber512</span></p>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>Quantum RNG:</strong> <span style={{color: '#60a5fa'}}>Active (Qiskit)</span></p>
          <p style={styles.statsText}><strong style={{color: '#ffffff'}}>Security Level:</strong> <span style={{color: '#86efac'}}>Post-Quantum</span></p>
        </div>
        
        <div style={styles.navButtons}>
          <button onClick={() => router.push('/dashboard')} style={styles.navButton}>
            ← Back to Dashboard
          </button>
        </div>
        
        <div style={styles.footer}>
          <p>🔒 Admin access restricted to authorized users</p>
          <p>⚛️ Kyber512 Post-Quantum Cryptography Active</p>
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
    fontSize: '2rem',
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
  adminBadge: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem',
    marginLeft: '0.5rem'
  },
  statsBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  statsTitle: {
    color: '#60a5fa',
    marginBottom: '0.5rem',
    fontSize: '1rem'
  },
  statsText: {
    color: '#cbd5e1',
    margin: '0.5rem 0'
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
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    width: '100%'
  },
  footer: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '0.7rem',
    marginTop: '1rem'
  }
};
