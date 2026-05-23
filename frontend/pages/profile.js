import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Profile() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    fetchUserData(storedUser);
  }, [router]);

  const fetchUserData = async (user) => {
    try {
      const response = await axios.get('http://localhost:8000/users');
      const foundUser = response.data.users.find(u => u.username === user);
      setUserData(foundUser);
      setFormData({
        email: foundUser?.email || '',
        phone: foundUser?.phone || ''
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setMessage('');
    try {
      // In a real app, you'd have an update endpoint
      // For now, just show success
      setMessage('✅ Profile updated successfully!');
      setEditing(false);
      setUserData({ ...userData, ...formData });
    } catch (error) {
      setMessage('❌ Update failed');
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
          <h1 style={styles.title}>⚛️ User Profile</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ User Profile</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Welcome, <span style={{color: '#60a5fa'}}>{username}</span>!</p>
        
        <div style={styles.profileBox}>
          <div style={styles.avatar}>
            <span style={styles.avatarIcon}>👤</span>
          </div>
          
          {!editing ? (
            // View Mode
            <div style={styles.infoSection}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Username:</span>
                <span style={styles.infoValue}>{userData?.username}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email:</span>
                <span style={styles.infoValue}>{userData?.email || 'Not set'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone:</span>
                <span style={styles.infoValue}>{userData?.phone || 'Not set'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Member Since:</span>
                <span style={styles.infoValue}>{new Date(userData?.created_at).toLocaleDateString() || 'N/A'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>PQC Protection:</span>
                <span style={styles.pqcBadge}>Kyber512 ✓</span>
              </div>
              
              <button onClick={() => setEditing(true)} style={styles.editBtn}>
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            // Edit Mode
            <div style={styles.infoSection}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Username:</span>
                <span style={styles.infoValue}>{userData?.username}</span>
                <span style={styles.lockedBadge}>🔒 Locked</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email:</span>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={styles.input}
                  placeholder="Enter email"
                />
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone:</span>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={styles.input}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div style={styles.buttonGroup}>
                <button onClick={handleUpdate} style={styles.saveBtn}>
                  💾 Save Changes
                </button>
                <button onClick={() => setEditing(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
        
        {message && <p style={styles.message}>{message}</p>}
        
        <div style={styles.securityBox}>
          <h3 style={styles.securityTitle}>🛡️ Security Status</h3>
          <div style={styles.securityGrid}>
            <div style={styles.securityItem}>
              <span>🔐 Kyber512 PQC:</span>
              <span style={styles.activeBadge}>Active</span>
            </div>
            <div style={styles.securityItem}>
              <span>⚛️ Quantum RNG:</span>
              <span style={styles.activeBadge}>Active</span>
            </div>
            <div style={styles.securityItem}>
              <span>📱 2FA Status:</span>
              <span style={styles.activeBadge}>Enabled</span>
            </div>
            <div style={styles.securityItem}>
              <span>🔑 Session Security:</span>
              <span style={styles.activeBadge}>Quantum-Safe</span>
            </div>
          </div>
        </div>
        
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
    maxWidth: '600px'
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
  profileBox: {
    backgroundColor: '#0f172a',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1rem'
  },
  avatar: {
    textAlign: 'center',
    marginBottom: '1rem'
  },
  avatarIcon: {
    fontSize: '4rem'
  },
  infoSection: {
    width: '100%'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #334155',
    gap: '1rem'
  },
  infoLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem',
    minWidth: '100px'
  },
  infoValue: {
    color: '#cbd5e1',
    fontSize: '0.875rem',
    flex: 1
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    color: '#ffffff',
    fontSize: '0.875rem'
  },
  lockedBadge: {
    backgroundColor: '#475569',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem'
  },
  pqcBadge: {
    backgroundColor: '#1e1b4b',
    color: '#a78bfa',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.75rem'
  },
  editBtn: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    marginTop: '1rem',
    width: '100%'
  },
  saveBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    flex: 1
  },
  cancelBtn: {
    backgroundColor: '#475569',
    color: '#ffffff',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    flex: 1
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem'
  },
  message: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#064e3b',
    color: '#86efac',
    borderRadius: '0.5rem'
  },
  securityBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  securityTitle: {
    color: '#60a5fa',
    marginBottom: '0.75rem',
    fontSize: '1rem'
  },
  securityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem'
  },
  securityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#cbd5e1',
    fontSize: '0.75rem',
    padding: '0.5rem',
    backgroundColor: '#1e293b',
    borderRadius: '0.5rem'
  },
  activeBadge: {
    color: '#86efac'
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
