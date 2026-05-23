import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function BackupCodes() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [codes, setCodes] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [showCodes, setShowCodes] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    fetchStatus(storedUser);
  }, [router]);

  const fetchStatus = async (user) => {
    try {
      const response = await axios.get(`http://localhost:8000/backup-codes-status?username=${user}`);
      setRemaining(response.data.remaining);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCodes = async () => {
    setGenerating(true);
    setMessage('');
    try {
      const response = await axios.post(`http://localhost:8000/generate-backup-codes?username=${username}`);
      setCodes(response.data.codes);
      setRemaining(8);
      setShowCodes(true);
      setMessage('✅ Backup codes generated! Save them securely.');
    } catch (error) {
      setMessage('❌ Failed to generate codes');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codes.join('\n'));
    setMessage('✅ Codes copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const downloadCodes = () => {
    const content = `QUANTUMID 2FA BACKUP CODES\n\nGenerated: ${new Date().toLocaleString()}\nUser: ${username}\n\n${codes.join('\n')}\n\n⚠️ Keep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantumid_backup_codes_${username}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
          <h1 style={styles.title}>⚛️ 2FA Backup Codes</h1>
          <p style={styles.subtitle}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ 2FA Backup Codes</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Welcome, <span style={{color: '#60a5fa'}}>{username}</span>!</p>
        
        <div style={styles.infoBox}>
          <p style={styles.infoText}>
            🔐 Backup codes allow you to access your account if you lose your phone 
            or cannot receive SMS/email OTPs.
          </p>
          <p style={styles.infoText}>
            ⚠️ Each code can be used only once. Keep them in a safe place.
          </p>
        </div>
        
        <div style={styles.statsBox}>
          <div style={styles.statItem}>
            <span style={styles.statLabel}>Remaining Backup Codes:</span>
            <span style={styles.statValue}>{remaining} / 8</span>
          </div>
        </div>
        
        {!showCodes ? (
          <button 
            onClick={generateCodes} 
            disabled={generating}
            style={styles.generateBtn}
          >
            {generating ? 'Generating...' : '🔑 Generate New Backup Codes'}
          </button>
        ) : (
          <div style={styles.codesBox}>
            <h3 style={styles.codesTitle}>📋 Your Backup Codes</h3>
            <p style={styles.codesWarning}>⚠️ Save these codes now! You won't see them again.</p>
            <div style={styles.codesGrid}>
              {codes.map((code, index) => (
                <div key={index} style={styles.codeItem}>
                  <code style={styles.code}>{code}</code>
                </div>
              ))}
            </div>
            <div style={styles.buttonGroup}>
              <button onClick={copyToClipboard} style={styles.copyBtn}>
                📋 Copy to Clipboard
              </button>
              <button onClick={downloadCodes} style={styles.downloadBtn}>
                💾 Download as File
              </button>
            </div>
          </div>
        )}
        
        {message && <p style={styles.message}>{message}</p>}
        
        <div style={styles.instructionsBox}>
          <h3 style={styles.instructionsTitle}>📖 How to Use</h3>
          <ol style={styles.instructionsList}>
            <li>Generate backup codes and save them securely</li>
            <li>When logging in, click "Use Backup Code" on the 2FA screen</li>
            <li>Enter one of your backup codes</li>
            <li>Each code can only be used once</li>
            <li>Generate new codes when you run low</li>
          </ol>
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
    maxWidth: '700px'
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
    margin: '0.5rem 0'
  },
  statsBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  statItem: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem'
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '1rem'
  },
  statValue: {
    color: '#86efac',
    fontSize: '1.5rem',
    fontWeight: 'bold'
  },
  generateBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  codesBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  codesTitle: {
    color: '#60a5fa',
    marginBottom: '0.5rem'
  },
  codesWarning: {
    color: '#fbbf24',
    fontSize: '0.75rem',
    marginBottom: '1rem'
  },
  codesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.5rem',
    marginBottom: '1rem'
  },
  codeItem: {
    backgroundColor: '#1e293b',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    textAlign: 'center'
  },
  code: {
    color: '#86efac',
    fontFamily: 'monospace',
    fontSize: '0.875rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem'
  },
  copyBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#475569',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  downloadBtn: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer'
  },
  message: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#064e3b',
    color: '#86efac',
    borderRadius: '0.5rem'
  },
  instructionsBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  instructionsTitle: {
    color: '#60a5fa',
    marginBottom: '0.5rem'
  },
  instructionsList: {
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
