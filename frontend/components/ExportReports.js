import { useState } from 'react';
import axios from 'axios';

export default function ExportReports() {
  const [loading, setLoading] = useState(false);

  const exportToCSV = async (type) => {
    setLoading(true);
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
          if (typeof val === 'string' && val.includes(',')) {
            val = `"${val}"`;
          }
          return val;
        });
        csvRows.push(values.join(','));
      }
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
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
      setLoading(false);
    }
  };

  const styles = {
    container: {
      background: 'rgba(25, 25, 45, 0.4)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '24px',
      padding: '1rem 1.25rem',
      marginBottom: '1.5rem'
    },
    title: { color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' },
    buttonGroup: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' },
    button: {
      background: 'rgba(139, 92, 246, 0.15)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '10px',
      color: '#cbd5e1',
      cursor: 'pointer',
      fontSize: '0.8rem',
      transition: 'all 0.3s ease'
    },
    loading: { color: '#22d3ee', fontSize: '0.7rem', marginTop: '0.5rem' }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>📥 Export Reports</h3>
      <div style={styles.buttonGroup}>
        <button onClick={() => exportToCSV('history')} disabled={loading} style={styles.button}>
          📜 Export Login History (CSV)
        </button>
        <button onClick={() => exportToCSV('users')} disabled={loading} style={styles.button}>
          👥 Export Users List (CSV)
        </button>
      </div>
      {loading && <p style={styles.loading}>Generating report...</p>}
    </div>
  );
}
