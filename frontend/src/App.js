import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [health, setHealth] = useState(null);
  const [status, setStatus] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Nowy log form state
  const [newLog, setNewLog] = useState({
    level: 'info',
    message: ''
  });

  const API_URL = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh co 10s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch health
      const healthRes = await fetch('/health');
      const healthData = await healthRes.json();
      setHealth(healthData);

      // Fetch status
      const statusRes = await fetch(`${API_URL}/status`);
      const statusData = await statusRes.json();
      setStatus(statusData);

      // Fetch logs
      const logsRes = await fetch(`${API_URL}/logs?limit=10`);
      const logsData = await logsRes.json();
      setLogs(logsData.logs);

      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${API_URL}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: newLog.level,
          message: newLog.message,
          metadata: { source: 'frontend' }
        })
      });

      if (response.ok) {
        setNewLog({ level: 'info', message: '' });
        fetchData(); // Refresh data
      }
    } catch (err) {
      console.error('Error submitting log:', err);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'up' || status === 'healthy') return '#10b981';
    if (status === 'degraded') return '#f59e0b';
    return '#ef4444';
  };

  const getLevelColor = (level) => {
    const colors = {
      info: '#3b82f6',
      warn: '#f59e0b',
      error: '#ef4444',
      debug: '#8b5cf6'
    };
    return colors[level] || '#6b7280';
  };

  if (loading && !health) {
    return (
      <div className="App">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 API Monitoring Dashboard</h1>
        <p className="subtitle">Real-time system monitoring</p>
      </header>

      {error && (
        <div className="alert alert-error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <main className="dashboard">
        {/* Health Status Card */}
        <div className="card">
          <h2>🏥 System Health</h2>
          {health && (
            <>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(health.status) }}>
                {health.status.toUpperCase()}
              </div>
              <div className="services">
                {Object.entries(health.services).map(([service, status]) => (
                  <div key={service} className="service-item">
                    <span className="service-name">{service}</span>
                    <span 
                      className="service-status"
                      style={{ color: getStatusColor(status) }}
                    >
                      ● {status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="metadata">
                <small>Uptime: {Math.floor(health.uptime)}s</small>
                <small>Last check: {new Date(health.timestamp).toLocaleTimeString()}</small>
              </div>
            </>
          )}
        </div>

        {/* Cache Status Card */}
        <div className="card">
          <h2>💾 Cache Status</h2>
          {status && (
            <>
              <p className="status-message">{status.message}</p>
              <div className="metadata">
                <small>Cached: {status.cached ? '✅ Yes' : '❌ No'}</small>
                <small>Updated: {new Date(status.timestamp).toLocaleTimeString()}</small>
              </div>
            </>
          )}
        </div>

        {/* Add Log Form */}
        <div className="card">
          <h2>➕ Add Log Entry</h2>
          <form onSubmit={handleSubmitLog} className="log-form">
            <div className="form-group">
              <label htmlFor="level">Level:</label>
              <select 
                id="level"
                value={newLog.level} 
                onChange={(e) => setNewLog({...newLog, level: e.target.value})}
              >
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="debug">Debug</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="message">Message:</label>
              <input
                id="message"
                type="text"
                value={newLog.message}
                onChange={(e) => setNewLog({...newLog, message: e.target.value})}
                placeholder="Enter log message..."
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Log</button>
          </form>
        </div>

        {/* Recent Logs Card */}
        <div className="card logs-card">
          <h2>📝 Recent Logs</h2>
          <div className="logs-list">
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <div key={log.id} className="log-entry">
                  <span 
                    className="log-level"
                    style={{ backgroundColor: getLevelColor(log.level) }}
                  >
                    {log.level}
                  </span>
                  <span className="log-message">{log.message}</span>
                  <span className="log-time">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="no-logs">No logs available</p>
            )}
          </div>
        </div>
      </main>

      <footer>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </footer>
    </div>
  );
}

export default App;


