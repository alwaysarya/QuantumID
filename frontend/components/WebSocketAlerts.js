import { useEffect, useState } from 'react';

export default function WebSocketAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/${username}`);
    
    ws.onopen = () => {
      setConnected(true);
      setAlerts(prev => [{
        id: Date.now(),
        message: '🟢 Real-time alerts connected',
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 20));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setAlerts(prev => [{
        id: Date.now(),
        message: data.message,
        timestamp: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 20));
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  const styles = {
    container: {
      background: 'rgba(25, 25, 45, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '24px',
      marginBottom: '1.5rem',
      overflow: 'hidden'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 1.25rem',
      borderBottom: '1px solid rgba(139, 92, 246, 0.2)'
    },
    title: { color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', margin: 0 },
    status: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    statusDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: connected ? '#10b981' : '#ef4444', boxShadow: connected ? '0 0 5px #10b981' : 'none', animation: connected ? 'pulse 2s infinite' : 'none' },
    statusText: { fontSize: '0.7rem', color: '#94a3b8' },
    alertsList: { maxHeight: '200px', overflowY: 'auto', padding: '0.5rem' },
    alert: { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '12px', marginBottom: '0.5rem' },
    alertTime: { fontSize: '0.6rem', color: '#64748b', fontFamily: 'monospace' },
    alertMessage: { fontSize: '0.75rem', color: '#cbd5e1' },
    noAlerts: { textAlign: 'center', color: '#64748b', padding: '1rem', fontSize: '0.75rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🔔 Real-time Alerts</h3>
        <div style={styles.status}>
          <div style={styles.statusDot}></div>
          <span style={styles.statusText}>{connected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      <div style={styles.alertsList}>
        {alerts.length === 0 ? (
          <p style={styles.noAlerts}>No alerts yet. Login to see real-time updates.</p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} style={styles.alert}>
              <span style={styles.alertTime}>[{alert.timestamp}]</span>
              <span style={styles.alertMessage}>{alert.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
