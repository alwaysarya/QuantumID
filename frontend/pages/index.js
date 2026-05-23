import Link from 'next/link';

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚛️ QuantumID</h1>
        <p style={styles.subtitle}>Post-Quantum Secure Digital Identity System</p>
        
        <div style={styles.buttonGroup}>
          <Link href="/login" style={styles.loginBtn}>
            Login
          </Link>
          <Link href="/register" style={styles.registerBtn}>
            Register
          </Link>
        </div>
        
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.icon}>🔐</span>
            <span>Kyber512 PQC</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>⚛️</span>
            <span>Quantum RNG</span>
          </div>
          <div style={styles.feature}>
            <span style={styles.icon}>🛡️</span>
            <span>Future Safe</span>
          </div>
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
    fontFamily: 'system-ui, sans-serif'
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2.5rem',
    borderRadius: '1rem',
    textAlign: 'center',
    maxWidth: '500px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#94a3b8',
    marginBottom: '2rem'
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem'
  },
  loginBtn: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  registerBtn: {
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  features: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '1rem'
  },
  feature: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#cbd5e1',
    fontSize: '0.875rem'
  },
  icon: {
    fontSize: '1.5rem',
    marginBottom: '0.25rem'
  }
};