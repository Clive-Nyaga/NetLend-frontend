import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard.jsx';
import './index.css';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', userType: 'admin' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', userType: 'admin' });

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginData);
    try {
      const response = await axios.post(`${API_BASE}/login`, loginData);
      console.log('Login response:', response.data);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Login successful, user set:', response.data.user);
      } else {
        alert('Login failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register attempt:', registerData);
    try {
      const response = await axios.post(`${API_BASE}/register`, registerData);
      console.log('Register response:', response.data);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Registration successful, user set:', response.data.user);
      } else {
        alert('Registration failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + (error.response?.data?.error || error.message));
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  if (user) {
    if (user.userType === 'admin') {
      return <AdminDashboard user={user} onLogout={handleLogout} />;
    } else {
      return (
        <div className="container">
          <h2>Welcome, {user.name}</h2>
          <p>User Type: {user.userType}</p>
          <p>This demo focuses on admin functionality.</p>
          <button className="btn danger" onClick={handleLogout}>Logout</button>
        </div>
      );
    }
  }

  return (
    <div className="container">
      <h2>Netland - {isLogin ? 'Login' : 'Register'}</h2>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button 
          className={`btn ${isLogin ? '' : 'warning'}`} 
          onClick={() => setIsLogin(true)}
          style={{ marginRight: '1rem' }}
        >
          Login
        </button>
        <button 
          className={`btn ${!isLogin ? '' : 'warning'}`} 
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      {isLogin ? (
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
      ) : (
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>User Type</label>
            <select
              value={registerData.userType}
              onChange={(e) => setRegisterData({...registerData, userType: e.target.value})}
            >
              <option value="admin">Administrator</option>
              <option value="lender">Lender</option>
              <option value="homebuyer">Homebuyer</option>
            </select>
          </div>
          <button type="submit" className="btn success">Register</button>
        </form>
      )}
      
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <p>Test Admin: admin@netland.com</p>
        <p>API Documentation: <a href="http://localhost:5000/docs" target="_blank" rel="noopener noreferrer">View Docs</a></p>
      </div>
    </div>
  );
}

export default App;