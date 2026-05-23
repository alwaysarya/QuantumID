import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FiUsers, FiAlertCircle, FiDollarSign, FiTrendingUp,
  FiMapPin, FiActivity, FiFileText, FiMail, FiDownload,
  FiUserPlus, FiBarChart2, FiCheckCircle, FiClock, FiXCircle,
  FiZap, FiShield, FiCpu, FiKey
} from 'react-icons/fi';

export default function EnhancedDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [quantumStats, setQuantumStats] = useState({
    otp: '',
    token: '',
    pqcStatus: 'Kyber512 Active'
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedToken = localStorage.getItem('session_token');
    
    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }
    
    setUsername(storedUser);
    setSessionToken(storedToken);
    
    const fetchQuantumStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/quantum/test');
        setQuantumStats({
          otp: response.data.otp,
          token: response.data.token,
          pqcStatus: 'Kyber512 Active'
        });
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

  const stats = [
    { title: 'Total Consumers', value: '1,250', change: '+12%', icon: <FiUsers />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { title: 'Pending Bills', value: '₹45,230', change: '-5%', icon: <FiAlertCircle />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Collected Today', value: '₹12,450', change: '+8%', icon: <FiDollarSign />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Outstanding', value: '₹1,08,150', change: '+3%', icon: <FiTrendingUp />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
  ];

  const quickActions = [
    { name: 'Add Consumer', icon: <FiUserPlus />, color: '#6366f1', link: '/add-consumer' },
    { name: 'Generate Bills', icon: <FiFileText />, color: '#10b981', link: '/generate-bills' },
    { name: 'View Reports', icon: <FiBarChart2 />, color: '#8b5cf6', link: '/analytics' },
    { name: 'Send Notices', icon: <FiMail />, color: '#f59e0b', link: '/notices' },
    { name: 'Export Data', icon: <FiDownload />, color: '#06b6d4', link: '/export' },
    { name: 'Manage Staff', icon: <FiUsers />, color: '#ec4899', link: '/staff' }
  ];

  const bills = [
    { id: 'EB202601000001', consumer: 'Rahul Sharma', units: 50, amount: 236.25, dueDate: '15/02/2026', status: 'pending', zone: 'North' },
    { id: 'EB202601000002', consumer: 'Priya Patel', units: 50, amount: 236.25, dueDate: '15/02/2026', status: 'paid', zone: 'South' },
    { id: 'EB202601000003', consumer: 'Amit Gupta', units: 300, amount: 2415.00, dueDate: '15/02/2026', status: 'pending', zone: 'East' },
    { id: 'EB202601000004', consumer: 'Sneha Reddy', units: 150, amount: 866.25, dueDate: '15/02/2026', status: 'overdue', zone: 'West' },
    { id: 'EB202601000005', consumer: 'Vikram Singh', units: 700, amount: 7297.50, dueDate: '15/02/2026', status: 'pending', zone: 'North' }
  ];

  const filteredBills = selectedTab === 'all' ? bills : bills.filter(bill => bill.status === selectedTab);
  const zoneData = [
    { name: 'North', value: 35, color: '#6366f1' },
    { name: 'South', value: 25, color: '#8b5cf6' },
    { name: 'East', value: 20, color: '#10b981' },
    { name: 'West', value: 20, color: '#f59e0b' }
  ];

  const revenueData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 58000 },
    { month: 'Jun', amount: 72000 }
  ];

  const statusCounts = {
    paid: bills.filter(b => b.status === 'paid').length,
    pending: bills.filter(b => b.status === 'pending').length,
    overdue: bills.filter(b => b.status === 'overdue').length
  };

  const liveActivities = [
    { time: '10:32', event: 'Bill EB202601000001 generated for Rahul Sharma', amount: '₹236.25', type: 'generated' },
    { time: '10:28', event: 'Payment received from Priya Patel', amount: '₹236.25', type: 'payment' },
    { time: '10:15', event: 'Bill EB202601000003 generated for Amit Gupta', amount: '₹2,415', type: 'generated' },
    { time: '09:58', event: 'Consumer complaint: Incorrect meter reading', type: 'complaint', status: 'open' },
    { time: '09:45', event: 'Sneha Reddy filed: Frequent power cuts', type: 'complaint', status: 'in_progress' }
  ];

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid': return { label: 'Paid', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <FiCheckCircle /> };
      case 'pending': return { label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <FiClock /> };
      case 'overdue': return { label: 'Overdue', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <FiXCircle /> };
      default: return { label: status, color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', icon: <FiActivity /> };
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>⚡ GridGuard</h1>
          <p style={styles.subtitle}>Hello, <span style={styles.username}>{username}</span> 🌟</p>
          <p style={styles.tagline}>Overview of your electricity billing system</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.timeBox}>
            <p style={styles.timeDate}>{time.toLocaleDateString()}</p>
            <p style={styles.timeValue}>{time.toLocaleTimeString()}</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ ...styles.statCard, background: stat.bg, borderBottom: `3px solid ${stat.color}` }}>
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIcon, color: stat.color }}>{stat.icon}</div>
              <span style={{ ...styles.statChange, color: stat.color }}>{stat.change}</span>
            </div>
            <p style={styles.statValue}>{stat.value}</p>
            <p style={styles.statTitle}>{stat.title}</p>
          </div>
        ))}
      </div>

      <div style={styles.actionsCard}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <p style={styles.sectionSubtitle}>Frequently used features</p>
        <div style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <div key={index} style={{ ...styles.actionBtn, background: 'rgba(99, 102, 241, 0.1)', border: `1px solid ${action.color}30` }}>
              <div style={{ ...styles.actionIcon, color: action.color }}>{action.icon}</div>
              <span style={styles.actionName}>{action.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.chartsRow}>
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Revenue Trend</h3>
          <div style={styles.chartContainer}>
            {revenueData.map((item, i) => (
              <div key={i} style={styles.barWrapper}>
                <div style={{ ...styles.bar, height: `${(item.amount / 72000) * 150}px`, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)' }}></div>
                <p style={styles.barLabel}>{item.month}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Zone Distribution</h3>
          <div style={styles.pieContainer}>
            {zoneData.map((zone, i) => (
              <div key={i} style={styles.pieSegment}>
                <div style={{ ...styles.pieColor, background: zone.color }}></div>
                <div style={styles.pieLabel}>
                  <span style={styles.pieName}>{zone.name}</span>
                  <span style={styles.pieValue}>{zone.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Bill Status</h3>
          <div style={styles.statusPie}>
            <div style={styles.statusLabels}>
              <div style={styles.statusLabelItem}><span style={{ background: '#10b981' }}></span> Paid ({statusCounts.paid})</div>
              <div style={styles.statusLabelItem}><span style={{ background: '#f59e0b' }}></span> Pending ({statusCounts.pending})</div>
              <div style={styles.statusLabelItem}><span style={{ background: '#ef4444' }}></span> Overdue ({statusCounts.overdue})</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Recent Bills</h3>
          <div style={styles.tabButtons}>
            <button onClick={() => setSelectedTab('all')} style={{ ...styles.tabBtn, ...(selectedTab === 'all' ? styles.tabActive : {}) }}>All</button>
            <button onClick={() => setSelectedTab('paid')} style={{ ...styles.tabBtn, ...(selectedTab === 'paid' ? styles.tabActive : {}) }}>Paid</button>
            <button onClick={() => setSelectedTab('pending')} style={{ ...styles.tabBtn, ...(selectedTab === 'pending' ? styles.tabActive : {}) }}>Pending</button>
            <button onClick={() => setSelectedTab('overdue')} style={{ ...styles.tabBtn, ...(selectedTab === 'overdue' ? styles.tabActive : {}) }}>Overdue</button>
          </div>
        </div>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableRow}>
                <th style={styles.th}>Bill #</th>
                <th style={styles.th}>Consumer</th>
                <th style={styles.th}>Units</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Due Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </table>
            </thead>
            <tbody>
              {filteredBills.map((bill, index) => {
                const status = getStatusBadge(bill.status);
                return (
                  <tr key={index} style={styles.tableRow}>
                    <td style={styles.td}>{bill.id}</td>
                    <td style={styles.td}>{bill.consumer}</td>
                    <td style={styles.td}>{bill.units}</td>
                    <td style={styles.td}>₹{bill.amount.toLocaleString()}</td>
                    <td style={styles.td}>{bill.dueDate}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button style={styles.pdfBtn}>PDF</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={styles.tableFooter}>
          <button style={styles.loadBtn}>Load Bills</button>
          <button style={styles.csvBtn}>CSV</button>
        </div>
      </div>

      <div style={styles.bottomRow}>
        <div style={styles.activityCard}>
          <h3 style={styles.sectionTitle}>Live Activity</h3>
          <p style={styles.sectionSubtitle}>Real-time system events</p>
          <div style={styles.activityList}>
            {liveActivities.map((activity, index) => (
              <div key={index} style={styles.activityItem}>
                <div style={styles.activityIcon}>
                  {activity.type === 'payment' ? '💰' : activity.type === 'complaint' ? '📢' : '📄'}
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>{activity.event}</p>
                  {activity.amount && <span style={styles.activityAmount}>{activity.amount}</span>}
                  {activity.status && <span style={{ ...styles.activityStatus, background: activity.status === 'open' ? '#ef4444' : '#f59e0b' }}>{activity.status}</span>}
                </div>
                <span style={styles.activityTime}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.mapCard}>
          <h3 style={styles.sectionTitle}>Live Consumer Map</h3>
          <p style={styles.sectionSubtitle}>📍 Green=Paid · Red=Overdue · Gold=Pending</p>
          <div style={styles.mapPlaceholder}>
            <div style={styles.mapGrid}>
              <div style={styles.mapMarker}><span>📍</span> North Zone</div>
              <div style={styles.mapMarker}><span>📍</span> South Zone</div>
              <div style={styles.mapMarker}><span>📍</span> East Zone</div>
              <div style={styles.mapMarker}><span>📍</span> West Zone</div>
            </div>
            <p style={styles.mapNote}>🗺️ {bills.length} consumers · Interactive map available in production</p>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <p>⚡ GridGuard AI - Smart Meter Intelligence System</p>
        <p>Powered by Kyber512 Post-Quantum Cryptography | Quantum RNG via Qiskit</p>
        <p>Real-time monitoring | Automated theft detection | Predictive analytics</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
    padding: '1.5rem',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f172a'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    marginBottom: '0.25rem'
  },
  subtitle: { color: '#94a3b8', fontSize: '0.875rem' },
  tagline: { color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' },
  username: { color: '#6366f1', fontWeight: 'bold' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  timeBox: { background: 'rgba(30, 41, 59, 0.7)', backdropFilter: 'blur(10px)', padding: '0.5rem 1rem', borderRadius: '12px', textAlign: 'right', border: '1px solid rgba(99, 102, 241, 0.2)' },
  timeDate: { fontSize: '0.7rem', color: '#94a3b8' },
  timeValue: { fontSize: '0.875rem', fontWeight: 'bold', color: '#fff' },
  logoutBtn: { background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px', color: '#fca5a5', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  statCard: { padding: '1rem', borderRadius: '16px' },
  statHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  statIcon: { fontSize: '1.5rem' },
  statChange: { fontSize: '0.75rem', fontWeight: 'bold' },
  statValue: { fontSize: '1.75rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' },
  statTitle: { fontSize: '0.75rem', color: '#94a3b8' },
  actionsCard: { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' },
  sectionTitle: { fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.25rem' },
  sectionSubtitle: { fontSize: '0.75rem', color: '#94a3b8', marginBottom: '1rem' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' },
  actionBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', borderRadius: '12px', cursor: 'pointer' },
  actionIcon: { fontSize: '1.25rem' },
  actionName: { fontSize: '0.7rem', color: '#cbd5e1', textAlign: 'center' },
  chartsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  chartCard: { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' },
  chartTitle: { fontSize: '0.875rem', fontWeight: 'bold', color: '#60a5fa', marginBottom: '1rem' },
  chartContainer: { display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '180px' },
  barWrapper: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' },
  bar: { width: '40px', borderRadius: '8px' },
  barLabel: { fontSize: '0.7rem', color: '#94a3b8' },
  pieContainer: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  pieSegment: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  pieColor: { width: '16px', height: '16px', borderRadius: '4px' },
  pieLabel: { flex: 1, display: 'flex', justifyContent: 'space-between', color: '#cbd5e1', fontSize: '0.875rem' },
  pieValue: { fontWeight: 'bold' },
  statusPie: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' },
  statusLabels: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  statusLabelItem: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: '#94a3b8' },
  tableCard: { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(99, 102, 241, 0.2)' },
  tableHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' },
  tabButtons: { display: 'flex', gap: '0.5rem' },
  tabBtn: { background: 'transparent', border: '1px solid #334155', padding: '0.25rem 0.75rem', borderRadius: '20px', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' },
  tabActive: { background: '#6366f1', borderColor: '#6366f1', color: '#fff' },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableRow: { borderBottom: '1px solid #334155' },
  th: { textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'bold' },
  td: { padding: '0.75rem', color: '#cbd5e1', fontSize: '0.75rem' },
  statusBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 'bold' },
  pdfBtn: { background: '#3b82f6', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '0.65rem' },
  tableFooter: { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' },
  loadBtn: { background: '#334155', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', cursor: 'pointer' },
  csvBtn: { background: '#10b981', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', color: '#fff', cursor: 'pointer' },
  bottomRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  activityCard: { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' },
  activityList: { maxHeight: '300px', overflowY: 'auto' },
  activityItem: { display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderBottom: '1px solid #334155' },
  activityIcon: { fontSize: '1.25rem' },
  activityContent: { flex: 1 },
  activityText: { fontSize: '0.7rem', color: '#cbd5e1' },
  activityAmount: { fontSize: '0.65rem', color: '#10b981', fontWeight: 'bold' },
  activityStatus: { fontSize: '0.6rem', padding: '0.125rem 0.375rem', borderRadius: '4px', color: '#fff' },
  activityTime: { fontSize: '0.6rem', color: '#64748b' },
  mapCard: { background: 'rgba(30, 41, 59, 0.5)', backdropFilter: 'blur(12px)', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' },
  mapPlaceholder: { background: '#0f172a', borderRadius: '12px', padding: '1rem', minHeight: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' },
  mapGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', width: '100%' },
  mapMarker: { background: '#1e293b', padding: '0.5rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8' },
  mapNote: { fontSize: '0.65rem', color: '#64748b', textAlign: 'center' },
  footer: { textAlign: 'center', padding: '1rem', borderTop: '1px solid #334155', color: '#475569', fontSize: '0.7rem' }
};
