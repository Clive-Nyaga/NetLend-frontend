import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import './index.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', userType: 'admin' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/login`, loginData);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = response.data.token;
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  if (user && user.userType === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="container">
      <h2>Netland Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>User Type</label>
          <select
            value={loginData.userType}
            onChange={(e) => setLoginData({...loginData, userType: e.target.value})}
          >
            <option value="admin">Administrator</option>
            <option value="lender">Lender</option>
            <option value="homebuyer">Homebuyer</option>
          </select>
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  );
}

export default App;