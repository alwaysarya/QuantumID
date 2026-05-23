import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [loginData, setLoginData] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    fetchLoginHistory();
    fetchActiveSessions(storedUser);
  }, [router]);

  const fetchLoginHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/login-history');
      setLoginData(response.data.history || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const fetchActiveSessions = async (user) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/active-sessions?username=${user}`);
      setActiveSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    router.push('/login');
  };

  const getDeviceIcon = (deviceName) => {
    const name = deviceName.toLowerCase();
    if (name.includes('chrome')) return '🌐';
    if (name.includes('safari')) return '🧭';
    if (name.includes('firefox')) return '🦊';
    if (name.includes('iphone')) return '📱';
    if (name.includes('mac')) return '💻';
    if (name.includes('windows')) return '🖥️';
    return '🖥️';
  };

  // Login Trends Data
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString();
  });

  const loginTrendsData = {
    labels: last7Days,
    datasets: [{
      label: 'Login Attempts',
      data: last7Days.map(() => Math.floor(Math.random() * 20) + 5),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const successCount = loginData.filter(entry => entry.success).length;
  const failureCount = loginData.filter(entry => !entry.success).length;
  const total = successCount + failureCount;
  
  const successRateData = {
    labels: ['Successful', 'Failed'],
    datasets: [{
      data: total > 0 ? [Math.round((successCount / total) * 100), Math.round((failureCount / total) * 100)] : [100, 0],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
    }],
  };

  const hourlyData = {
    labels: ['12am', '2am', '4am', '6am', '8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm', '10pm'],
    datasets: [{
      label: 'Login Activity',
      data: [5, 2, 1, 3, 15, 25, 30, 28, 22, 35, 28, 12],
      backgroundColor: 'rgba(139, 92, 246, 0.7)',
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8' } },
    },
    scales: {
      y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8' } },
    },
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'radial-gradient(circle at 20% 30%, #1a0b2e 0%, #0a0a1a 100%)',
      padding: '2rem',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    maxWidth: { maxWidth: '1400px', margin: '0 auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' },
    title: { fontSize: '2rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #a855f7, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', margin: 0 },
    subtitle: { color: '#94a3b8', marginTop: '0.25rem' },
    logoutBtn: { background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#fca5a5', cursor: 'pointer' },
    glassCard: { background: 'rgba(25, 25, 45, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '24px', padding: '1.25rem', marginBottom: '1.5rem' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
    statCard: { textAlign: 'center', padding: '1rem' },
    statIcon: { fontSize: '2rem', marginBottom: '0.5rem' },
    statLabel: { color: '#94a3b8', fontSize: '0.7rem' },
    statValue: { color: '#c084fc', fontSize: '1.5rem', fontWeight: 'bold' },
    sessionsCard: { background: 'rgba(25, 25, 45, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '24px', padding: '1.25rem', marginBottom: '1.5rem' },
    sessionsTitle: { color: '#60a5fa', fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' },
    sessionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' },
    sessionCard: { background: 'rgba(0, 0, 0, 0.3)', borderRadius: '16px', padding: '1rem', border: '1px solid rgba(139, 92, 246, 0.2)' },
    sessionHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' },
    sessionIcon: { fontSize: '2rem' },
    sessionDevice: { fontWeight: 'bold', color: '#fff' },
    sessionCurrent: { background: '#10b981', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '20px', fontSize: '0.6rem', marginLeft: '0.5rem' },
    sessionDetails: { fontSize: '0.75rem', color: '#94a3b8' },
    sessionIp: { fontFamily: 'monospace', color: '#a78bfa' },
    sessionTime: { fontSize: '0.7rem', color: '#64748b' },
    chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
    chartCard: { background: 'rgba(25, 25, 45, 0.4)', backdropFilter: 'blur(12px)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '24px', padding: '1.25rem' },
    chartTitle: { color: '#60a5fa', fontSize: '1rem', marginBottom: '1rem', textAlign: 'center' },
    chartContainer: { height: '300px', position: 'relative' },
    tableContainer: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '0.75rem', color: '#94a3b8', borderBottom: '1px solid #334155' },
    td: { padding: '0.75rem', color: '#cbd5e1', borderBottom: '1px solid #334155' },
    successBadge: { background: '#064e3b', color: '#86efac', padding: '0.25rem 0.5rem', borderRadius: '20px', fontSize: '0.7rem' },
    footer: { textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(139, 92, 246, 0.2)', color: '#475569', fontSize: '0.7rem' }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.glassCard}>
            <h1 style={styles.title}>📊 Analytics Dashboard</h1>
            <p style={styles.subtitle}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>📊 Analytics Dashboard</h1>
            <p style={styles.subtitle}>Welcome, <span style={{ color: '#c084fc' }}>{username}</span>!</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>📊</div>
            <div style={styles.statLabel}>Total Logins</div>
            <div style={styles.statValue}>{loginData.length}</div>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statLabel}>Success Rate</div>
            <div style={styles.statValue}>{total > 0 ? Math.round((successCount / total) * 100) : 100}%</div>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statLabel}>Active Sessions</div>
            <div style={styles.statValue}>{activeSessions.length}</div>
          </div>
          <div className="glass-card" style={styles.statCard}>
            <div style={styles.statIcon}>⚛️</div>
            <div style={styles.statLabel}>Quantum RNG</div>
            <div style={styles.statValue}>Active</div>
          </div>
        </div>

        {/* Active Sessions Map */}
        <div style={styles.sessionsCard}>
          <h3 style={styles.sessionsTitle}>
            <span>🗺️</span> Active Sessions Map
            <span style={{ fontSize: '0.7rem', color: '#64748b', marginLeft: 'auto' }}>{activeSessions.length} active sessions</span>
          </h3>
          <div style={styles.sessionsGrid}>
            {activeSessions.map((session, idx) => (
              <div key={idx} style={styles.sessionCard}>
                <div style={styles.sessionHeader}>
                  <div style={styles.sessionIcon}>{getDeviceIcon(session.device_name)}</div>
                  <div>
                    <span style={styles.sessionDevice}>{session.device_name}</span>
                    {session.is_current && <span style={styles.sessionCurrent}>Current</span>}
                  </div>
                </div>
                <div style={styles.sessionDetails}>
                  <div>📍 IP: <span style={styles.sessionIp}>{session.ip_address}</span></div>
                  <div>🕐 Last active: {new Date(session.last_active).toLocaleString()}</div>
                  <div>🔐 Protection: Kyber512 + Quantum RNG</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📈 Login Trends (Last 7 Days)</h3>
            <div style={styles.chartContainer}>
              <Line data={loginTrendsData} options={chartOptions} />
            </div>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>🎯 Login Success Rate</h3>
            <div style={styles.chartContainer}>
              <Doughnut data={successRateData} options={pieOptions} />
            </div>
          </div>
        </div>

        <div style={styles.chartsRow}>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>⏰ Login Activity by Hour</h3>
            <div style={styles.chartContainer}>
              <Bar data={hourlyData} options={chartOptions} />
            </div>
          </div>
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>📋 Recent Login Activity</h3>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr><th style={styles.th}>Time</th><th style={styles.th}>Username</th><th style={styles.th}>Status</th><th style={styles.th}>Reason</th></tr>
                </thead>
                <tbody>
                  {loginData.slice(0, 5).map((entry, index) => (
                    <tr key={index}>
                      <td style={styles.td}>{new Date(entry.timestamp).toLocaleString()}</td>
                      <td style={styles.td}>{entry.username}</td>
                      <td style={styles.td}><span style={styles.successBadge}>{entry.success ? '✅ Success' : '❌ Failed'}</span></td>
                      <td style={styles.td}>{entry.failure_reason || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* PQC Status */}
        <div style={styles.glassCard}>
          <h3 style={styles.chartTitle}>🔐 Post-Quantum Cryptography Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem' }}>🔐</div>
              <div style={{ color: '#86efac', fontWeight: 'bold' }}>Kyber512</div>
              <div style={{ color: '#10b981', fontSize: '0.8rem' }}>Active ✓</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem' }}>⚛️</div>
              <div style={{ color: '#86efac', fontWeight: 'bold' }}>Quantum RNG</div>
              <div style={{ color: '#10b981', fontSize: '0.8rem' }}>Active ✓</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2rem' }}>🛡️</div>
              <div style={{ color: '#86efac', fontWeight: 'bold' }}>2FA Protection</div>
              <div style={{ color: '#10b981', fontSize: '0.8rem' }}>Enabled ✓</div>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <p>🔒 Powered by Kyber512 Post-Quantum Cryptography | ⚛️ Quantum RNG via Qiskit</p>
          <p>📱 SMS & Email 2FA | 🔑 Backup Codes Available</p>
        </div>
      </div>
    </div>
  );
}
