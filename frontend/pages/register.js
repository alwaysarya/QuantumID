import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:8000/register', {
        username,
        email,
        phone,
        password
      });
      setMessage(`✅ ${response.data.message}`);
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.detail || 'Registration failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚛️ Register</h1>
        <p style={styles.subtitle}>Create Kyber512 Protected Account</p>
        
        <input 
          type="text" 
          placeholder="Username" 
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="email" 
          placeholder="Email" 
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="tel" 
          placeholder="Phone Number (e.g., +917543907912)" 
          style={styles.input}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          onClick={handleRegister}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Registering...' : 'Register with Kyber512'}
        </button>
        
        {message && <p style={message.includes('✅') ? styles.successMsg : styles.errorMsg}>{message}</p>}
        
        <p style={styles.footer}>
          🔒 Kyber512 Post-Quantum Cryptography | 📱 SMS 2FA Ready
        </p>
        <p style={styles.link}>
          <Link href="/login" style={{ color: '#60a5fa' }}>Already have an account? Login</Link>
        </p>
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
    padding: '2rem',
    borderRadius: '1rem',
    width: '450px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: '2rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    backgroundColor: '#334155',
    border: 'none',
    borderRadius: '0.5rem',
    color: '#ffffff',
    fontSize: '1rem'
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  successMsg: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#064e3b',
    color: '#86efac',
    borderRadius: '0.5rem'
  },
  errorMsg: {
    textAlign: 'center',
    padding: '0.5rem',
    marginTop: '1rem',
    backgroundColor: '#7f1d1d',
    color: '#fca5a5',
    borderRadius: '0.5rem'
  },
  footer: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: '0.7rem',
    marginTop: '1rem'
  },
  link: {
    textAlign: 'center',
    marginTop: '0.5rem',
    fontSize: '0.875rem'
  }
};
