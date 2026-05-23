import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShield, FiActivity, FiLock, FiCpu, FiBell, FiUsers, 
  FiTrendingUp, FiCheckCircle, FiAlertCircle, FiLogOut,
  FiBarChart2, FiUser, FiKey, FiDatabase, FiGlobe, FiZap
} from 'react-icons/fi';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

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
  const [time, setTime] = useState(new Date());
  const [particles, setParticles] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

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
    
    // Create particle effect
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 10 + 5
      });
    }
    setParticles(newParticles);
    
    // Timer
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('session_token');
    router.push('/login');
  };

  // Sample data for charts
  const loginTrends = [
    { hour: '00:00', logins: 12 },
    { hour: '04:00', logins: 5 },
    { hour: '08:00', logins: 45 },
    { hour: '12:00', logins: 78 },
    { hour: '16:00', logins: 89 },
    { hour: '20:00', logins: 67 },
    { hour: '24:00', logins: 23 }
  ];

  const anomalyData = [
    { name: 'Successful', value: 87, color: '#10b981' },
    { name: 'Failed', value: 13, color: '#ef4444' }
  ];

  const securityStats = [
    { name: 'Total Users', value: 1250, icon: <FiUsers />, change: '+12%' },
    { name: 'Active Sessions', value: 234, icon: <FiActivity />, change: '+5%' },
    { name: 'Alerts Today', value: 23, icon: <FiAlertCircle />, change: '-8%' },
    { name: 'Security Score', value: '98%', icon: <FiShield />, change: '+2%' }
  ];

  const features = [
    { name: 'Kyber512 PQC', status: 'Active', icon: <FiLock />, color: '#6366f1' },
    { name: 'Quantum RNG', status: 'Active', icon: <FiCpu />, color: '#8b5cf6' },
    { name: '2FA Enabled', status: 'Active', icon: <FiKey />, color: '#10b981' },
    { name: 'Session Protection', status: 'Active', icon: <FiShield />, color: '#06b6d4' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 overflow-hidden">
      {/* Particle Background */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float ${particle.duration}s infinite ease-in-out`
          }}
        />
      ))}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              QuantumID Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Welcome back, <span className="text-indigo-400 font-semibold">{username}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 rounded-xl text-right">
              <p className="text-sm text-slate-400">{time.toLocaleDateString()}</p>
              <p className="text-sm font-semibold text-white">{time.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={handleLogout}
              className="glass hover:bg-red-500/20 transition-all duration-300 px-4 py-2 rounded-xl flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {securityStats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover-card cursor-pointer"
              onMouseEnter={() => setHoveredCard(stat.name)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-indigo-400 text-3xl">{stat.icon}</div>
                <span className="text-green-400 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-slate-400 text-sm">{stat.name}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FiTrendingUp className="text-indigo-400 text-xl" />
              <h3 className="text-lg font-semibold text-white">Login Trends (Last 24h)</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={loginTrends}>
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="logins" stroke="#6366f1" fillOpacity={1} fill="url(#colorLogins)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <FiBarChart2 className="text-indigo-400 text-xl" />
              <h3 className="text-lg font-semibold text-white">Auth Success Rate</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={anomalyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#94a3b8' }}
                >
                  {anomalyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Security Features Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <FiShield className="text-indigo-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Quantum Security Features</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500 transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl" style={{ color: feature.color }}>{feature.icon}</div>
                  <p className="font-semibold text-white">{feature.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="status-online"></div>
                  <span className="text-green-400 text-sm">{feature.status}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Session Info */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-2 mb-6">
            <FiActivity className="text-indigo-400 text-xl" />
            <h3 className="text-lg font-semibold text-white">Session Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-800/30 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Session Token</p>
              <p className="text-indigo-400 font-mono text-sm break-all">{sessionToken}</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Quantum OTP</p>
              <p className="text-purple-400 font-mono text-2xl font-bold">{quantumStats.otp}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="status-online"></div>
              <span className="text-green-400 text-sm">Secure Connection</span>
            </div>
            <div className="progress-bar w-48">
              <div className="progress-fill" style={{ width: '98%' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap gap-3 mt-8 justify-center"
        >
          <Link href="/profile" className="glass px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all duration-300 flex items-center gap-2 text-sm">
            <FiUser /> Profile
          </Link>
          <Link href="/analytics" className="glass px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all duration-300 flex items-center gap-2 text-sm">
            <FiBarChart2 /> Analytics
          </Link>
          <Link href="/history" className="glass px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all duration-300 flex items-center gap-2 text-sm">
            <FiDatabase /> History
          </Link>
          <Link href="/devices" className="glass px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all duration-300 flex items-center gap-2 text-sm">
            <FiGlobe /> Devices
          </Link>
          <Link href="/backup-codes" className="glass px-4 py-2 rounded-xl hover:bg-indigo-500/20 transition-all duration-300 flex items-center gap-2 text-sm">
            <FiKey /> Backup Codes
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
