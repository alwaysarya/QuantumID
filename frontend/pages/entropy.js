import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Entropy() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [quantumNumbers, setQuantumNumbers] = useState([]);
  const [currentOTP, setCurrentOTP] = useState('');
  const [currentToken, setCurrentToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    generateQuantumNumbers();
  }, [router]);

  const generateQuantumNumbers = async () => {
    setGenerating(true);
    try {
      const response = await axios.get('http://localhost:8000/quantum/test');
      const newOTP = response.data.otp;
      const newToken = response.data.token;
      
      setCurrentOTP(newOTP);
      setCurrentToken(newToken);
      
      // Add to history (keep last 20)
      setQuantumNumbers(prev => {
        const newEntry = {
          otp: newOTP,
          token: newToken.substring(0, 16),
          timestamp: new Date().toLocaleTimeString()
        };
        return [newEntry, ...prev].slice(0, 20);
      });
      
    } catch (error) {
      console.error('Failed to generate quantum numbers:', error);
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    router.push('/login');
  };

  // Calculate entropy visualization bars
  const getEntropyBar = (otp) => {
    const num = parseInt(otp) % 100;
    const width = num;
    return width;
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>⚛️ Quantum Entropy Visualizer</h1>
          <p style={styles.subtitle}>Loading quantum data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>⚛️ Quantum Entropy Visualizer</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
        
        <p style={styles.subtitle}>Welcome, {username}! Watch true quantum randomness in real-time</p>
        
        {/* Live Quantum Randomness Display */}
        <div style={styles.liveBox}>
          <h3 style={styles.liveTitle}>🎲 Live Quantum Randomness</h3>
          <div style={styles.liveGrid}>
            <div style={styles.liveCard}>
              <span style={styles.liveIcon}>⚛️</span>
              <span style={styles.liveLabel}>Quantum OTP</span>
              <span style={styles.liveValue}>{currentOTP}</span>
            </div>
            <div style={styles.liveCard}>
              <span style={styles.liveIcon}>🔐</span>
              <span style={styles.liveLabel}>Session Token</span>
              <span style={styles.liveValueSmall}>{currentToken.substring(0, 16)}</span>
            </div>
          </div>
          
          <button 
            onClick={generateQuantumNumbers} 
            disabled={generating}
            style={styles.generateBtn}
          >
            {generating ? 'Generating...' : '🌀 Generate New Quantum Random Numbers'}
          </button>
        </div>
        
        {/* Entropy Visualization */}
        <div style={styles.entropyBox}>
          <h3 style={styles.entropyTitle}>📊 Quantum Entropy Visualization</h3>
          <p style={styles.entropyDesc}>Each bar represents a quantum-random OTP value</p>
          
          <div style={styles.barsContainer}>
            {quantumNumbers.slice(0, 10).map((item, index) => (
              <div key={index} style={styles.barWrapper}>
                <div 
                  style={{
                    ...styles.bar,
                    height: `${getEntropyBar(item.otp)}px`,
                    backgroundColor: `hsl(${getEntropyBar(item.otp) * 3.6}, 70%, 50%)`
                  }}
                />
                <span style={styles.barLabel}>{item.otp}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Recent Quantum History */}
        <div style={styles.historyBox}>
          <h3 style={styles.historyTitle}>📜 Recent Quantum Random Numbers</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Time</th>
                <th style={styles.th}>Quantum OTP</th>
                <th style={styles.th}>Session Token (First 16 bits)</th>
                <th style={styles.th}>Entropy</th>
               </tr>
            </thead>
            <tbody>
              {quantumNumbers.map((item, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.td}>{item.timestamp}</td>
                  <td style={styles.td}>
                    <span style={styles.otpBadge}>{item.otp}</span>
                   </td>
                  <td style={styles.td}>
                    <code style={styles.code}>{item.token}</code>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.entropyBadge}>Quantum</span>
                  </td>
                 </tr>
              ))}
            </tbody>
          </table>
          {quantumNumbers.length === 0 && (
            <p style={styles.noData}>Click "Generate" to see quantum random numbers</p>
          )}
        </div>
        
        {/* How It Works */}
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>⚛️ How Quantum Entropy Works</h3>
          <ul style={styles.infoList}>
            <li>✅ Numbers generated using Qiskit Hadamard gates (quantum superposition)</li>
            <li>✅ True randomness - not pseudo-random (unlike classical computers)</li>
            <li>✅ Each OTP is unique and unpredictable</li>
            <li>✅ Entropy source: Quantum measurement collapse</li>
            <li>✅ Future-proof against pattern prediction attacks</li>
          </ul>
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
          <p>🔒 Powered by Qiskit Aer Simulator | True Quantum Random Number Generation</p>
          <p>⚛️ Hadamard gates create superposition → Measurement collapses to random state</p>
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
    marginBottom: '1.5rem'
  },
  liveBox: {
    backgroundColor: '#0f172a',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  liveTitle: {
    color: '#60a5fa',
    marginBottom: '1rem'
  },
  liveGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem'
  },
  liveCard: {
    backgroundColor: '#334155',
    padding: '1rem',
    borderRadius: '0.5rem'
  },
  liveIcon: {
    fontSize: '2rem',
    display: 'block'
  },
  liveLabel: {
    color: '#94a3b8',
    fontSize: '0.75rem',
    display: 'block'
  },
  liveValue: {
    color: '#86efac',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    display: 'block'
  },
  liveValueSmall: {
    color: '#86efac',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    display: 'block',
    fontFamily: 'monospace'
  },
  generateBtn: {
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  entropyBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  entropyTitle: {
    color: '#60a5fa',
    marginBottom: '0.5rem'
  },
  entropyDesc: {
    color: '#94a3b8',
    fontSize: '0.75rem',
    marginBottom: '1rem'
  },
  barsContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '1rem',
    padding: '1rem 0',
    overflowX: 'auto'
  },
  barWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '40px'
  },
  bar: {
    width: '30px',
    borderRadius: '4px',
    transition: 'height 0.3s ease',
    marginBottom: '0.5rem'
  },
  barLabel: {
    color: '#cbd5e1',
    fontSize: '0.7rem'
  },
  historyBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  historyTitle: {
    color: '#60a5fa',
    marginBottom: '1rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.8rem'
  },
  tableHeader: {
    backgroundColor: '#334155'
  },
  th: {
    padding: '0.5rem',
    textAlign: 'left',
    color: '#ffffff'
  },
  tableRow: {
    borderBottom: '1px solid #334155'
  },
  td: {
    padding: '0.5rem',
    color: '#cbd5e1'
  },
  otpBadge: {
    backgroundColor: '#1e1b4b',
    color: '#a78bfa',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontFamily: 'monospace'
  },
  code: {
    backgroundColor: '#1e293b',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem'
  },
  entropyBadge: {
    backgroundColor: '#064e3b',
    color: '#86efac',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    fontSize: '0.7rem'
  },
  noData: {
    textAlign: 'center',
    color: '#64748b',
    padding: '2rem'
  },
  infoBox: {
    backgroundColor: '#0f172a',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginBottom: '1rem'
  },
  infoTitle: {
    color: '#60a5fa',
    marginBottom: '0.5rem'
  },
  infoList: {
    color: '#cbd5e1',
    fontSize: '0.8rem',
    margin: 0,
    paddingLeft: '1.25rem'
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
