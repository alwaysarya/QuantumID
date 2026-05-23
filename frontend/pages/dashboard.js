import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import WebSocketAlerts from '../components/WebSocketAlerts';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 20% 30%, #1a0b2e 0%, #0a0a1a 100%)',
    padding: '2rem',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 20% 30%, #1a0b2e 0%, #0a0a1a 100%)'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '3px solid rgba(139, 92, 246, 0.3)',
    borderTopColor: '#8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  maxWidth: { maxWidth: '1200px', margin: '0 auto' },
  
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
  title: { fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.25rem' },
  subtitle: { color: '#94a3b8', fontSize: '0.875rem' },
  username: { color: '#c084fc', fontWeight: 'bold' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  timeBox: { background: 'rgba(30, 27, 46, 0.6)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(139, 92, 246, 0.3)' },
  timeDate: { fontSize: '0.7rem', color: '#94a3b8' },
  timeValue: { fontSize: '0.875rem', fontWeight: 'bold', color: '#fff' },
  logoutBtn: { background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1.25rem', borderRadius: '12px', color: '#fca5a5', cursor: 'pointer', fontWeight: '500' },
  
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' },
  statCard: { padding: '1.25rem', textAlign: 'center' },
  statIcon: { fontSize: '2.5rem', marginBottom: '0.5rem' },
  statLabel: { color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' },
  statValue: { fontSize: '1.25rem', fontWeight: 'bold', color: '#c084fc' },
  statValueLarge: { fontSize: '1.75rem', fontWeight: 'bold', color: '#22d3ee' },
  statValueSmall: { fontSize: '0.7rem', fontFamily: 'monospace', color: '#a78bfa', wordBreak: 'break-all' },
  
  glassCard: { background: 'rgba(25, 25, 45, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '24px', marginBottom: '1.5rem', overflow: 'hidden' },
  sectionHeader: { padding: '1rem 1.25rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' },
  sectionTitle: { fontSize: '1rem', fontWeight: 'bold', color: '#fff', margin: 0 },
  sectionContent: { padding: '1rem 1.25rem' },
  
  linksContainer: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem' },
  linkBtn: { background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#cbd5e1', textDecoration: 'none', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-block' },
  
  exportBtn: { background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#86efac', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.75rem', marginBottom: '0.5rem' },
  
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' },
  featureItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1', fontSize: '0.8rem' },
  
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '12px', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' },
  infoLabel: { color: '#94a3b8', fontSize: '0.8rem' },
  infoValue: { color: '#fff', fontSize: '0.8rem', fontWeight: '500' },
  infoValueMono: { color: '#a78bfa', fontSize: '0.7rem', fontFamily: 'monospace', wordBreak: 'break-all' },
  
  footer: { textAlign: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(139, 92, 246, 0.2)' },
  footerText: { color: '#475569', fontSize: '0.7rem', margin: '0.25rem 0' }
};

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [quantumStats, setQuantumStats] = useState({ otp: '', token: '', pqcStatus: 'Kyber512 Active' });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [time, setTime] = useState(new Date());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    setSessionToken(storedToken);
    
    if (storedUser === 'testuser') setIsAdmin(true);
    
    const fetchQuantumStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/quantum/test');
        setQuantumStats({ otp: response.data.otp, token: response.data.token, pqcStatus: 'Kyber512 Active' });
      } catch (error) {
        console.error('Failed to fetch quantum stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuantumStats();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    router.push('/login');
  };

  const exportToCSV = async (type) => {
    setExporting(true);
    try {
      let data = [];
      let filename = '';
      
      if (type === 'history') {
        const response = await axios.get('http://localhost:8000/login-history');
        data = response.data.history || [];
        filename = 'login_history.csv';
      } else if (type === 'users') {
        const response = await axios.get('http://localhost:8000/users');
        data = response.data.users || [];
        filename = 'users_list.csv';
      }
      
      if (data.length === 0) {
        alert('No data to export');
        return;
      }
      
      const headers = Object.keys(data[0]);
      const csvRows = [headers.join(',')];
      
      for (const row of data) {
        const values = headers.map(header => {
          let val = row[header] || '';
          if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
          return val;
        });
        csvRows.push(values.join(','));
      }
      
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes gradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .glass-card { background: rgba(25, 25, 45, 0.4); backdrop-filter: blur(12px); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 24px; transition: all 0.3s ease; }
        .glass-card:hover { border-color: rgba(139, 92, 246, 0.8); box-shadow: 0 0 25px rgba(139, 92, 246, 0.2); transform: translateY(-2px); }
        .gradient-text { background: linear-gradient(135deg, #a855f7, #8b5cf6, #6366f1, #06b6d4); background-size: 300% 300%; -webkit-background-clip: text; background-clip: text; color: transparent; animation: gradientShift 5s ease infinite; }
        .btn-link:hover { background: rgba(139, 92, 246, 0.3); border-color: rgba(139, 92, 246, 0.6); color: white; }
        .export-btn:hover { background: rgba(16, 185, 129, 0.3); border-color: rgba(16, 185, 129, 0.6); }
      `}</style>
      
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 className="gradient-text" style={styles.title}>⚛️ QuantumID</h1>
            <p style={styles.subtitle}>Welcome back, <span style={styles.username}>{username}</span></p>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.timeBox}>
              <p style={styles.timeDate}>{time.toLocaleDateString()}</p>
              <p style={styles.timeValue}>{time.toLocaleTimeString()}</p>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        </div>

        {/* WebSocket Alerts */}
        <WebSocketAlerts />

        {/* Export Reports Section - VISIBLE NOW */}
        <div className="glass-card" style={styles.glassCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>📥 Export Reports</h3>
          </div>
          <div style={styles.sectionContent}>
            <div style={styles.linksContainer}>
              <button onClick={() => exportToCSV('history')} disabled={exporting} className="export-btn" style={styles.exportBtn}>
                📜 Export Login History (CSV)
              </button>
              <button onClick={() => exportToCSV('users')} disabled={exporting} className="export-btn" style={styles.exportBtn}>
                👥 Export Users List (CSV)
              </button>
            </div>
            {exporting && <p style={{ color: '#22d3ee', fontSize: '0.7rem', marginTop: '0.5rem' }}>Generating report...</p>}
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>🔐</div>
            <div style={styles.statLabel}>PQC Algorithm</div>
            <div style={styles.statValue}>{quantumStats.pqcStatus}</div>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>⚛️</div>
            <div style={styles.statLabel}>Quantum OTP</div>
            <div style={styles.statValueLarge}>{quantumStats.otp}</div>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>🛡️</div>
            <div style={styles.statLabel}>Security Level</div>
            <div style={styles.statValue}>Post-Quantum</div>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>📅</div>
            <div style={styles.statLabel}>Session Token</div>
            <div style={styles.statValueSmall}>{sessionToken.substring(0, 24)}...</div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="glass-card" style={styles.glassCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>✨ Quick Navigation</h3>
          </div>
          <div style={styles.sectionContent}>
            <div style={styles.linksContainer}>
              <Link href="/profile" className="btn-link" style={styles.linkBtn}>👤 User Profile</Link>
              <Link href="/backup-codes" className="btn-link" style={styles.linkBtn}>🔑 Backup Codes</Link>
              <Link href="/devices" className="btn-link" style={styles.linkBtn}>📱 Device Management</Link>
              <Link href="/analytics" className="btn-link" style={styles.linkBtn}>📊 Analytics Dashboard</Link>
              <Link href="/entropy" className="btn-link" style={styles.linkBtn}>⚛️ Quantum Entropy</Link>
              <Link href="/history" className="btn-link" style={styles.linkBtn}>📜 Login History</Link>
              <Link href="/rate-limit" className="btn-link" style={styles.linkBtn}>🛡️ Rate Limits</Link>
              {isAdmin && <Link href="/admin" className="btn-link" style={styles.linkBtn}>🔐 Admin Panel</Link>}
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="glass-card" style={styles.glassCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>🔒 Quantum Security Features</h3>
          </div>
          <div style={styles.sectionContent}>
            <div style={styles.featuresGrid}>
              {['Kyber512 Post-Quantum Cryptography', 'Quantum Random Number Generation (Qiskit)', 'Session tokens from quantum entropy', 'SHA3-256 Quantum-safe hashing', 'SMS & Email 2FA', 'Real-time WebSocket Alerts', 'Export Reports (CSV)', '2FA Backup Codes', 'Device Management', 'Future-proof against Shor\'s algorithm'].map((feature, i) => (
                <div key={i} style={styles.featureItem}><span style={{ color: '#22d3ee' }}>✦</span> {feature}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Session Information */}
        <div className="glass-card" style={styles.glassCard}>
          <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>📊 Session Information</h3>
          </div>
          <div style={styles.sectionContent}>
            <div style={styles.infoRow}><span style={styles.infoLabel}>User:</span><span style={styles.infoValue}>{username}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Session Token:</span><span style={styles.infoValueMono}>{sessionToken}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Protection:</span><span style={{ ...styles.infoValue, color: '#22d3ee' }}>Kyber512 + Quantum RNG</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Status:</span><span style={styles.infoValue}><span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', display: 'inline-block', marginRight: '0.5rem', boxShadow: '0 0 5px #10b981', animation: 'pulse 2s infinite' }}></span> Active & Secure</span></div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>🔒 Protected by Kyber512 (NIST Post-Quantum Standard)</p>
          <p style={styles.footerText}>⚛️ Quantum Random Numbers via Qiskit Hadamard Circuits</p>
        </div>
      </div>
    </div>
  );
}
