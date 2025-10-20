import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function AdminDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    loadUsers();
    loadAnalytics();
    loadFeedback();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users');
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/analytics`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics');
    }
  };

  const loadFeedback = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/feedback`);
      setFeedback(response.data);
    } catch (error) {
      console.error('Failed to load feedback');
    }
  };

  const moderateFeedback = async (feedbackId, status) => {
    try {
      await axios.put(`${API_BASE}/admin/feedback/${feedbackId}`, { status });
      loadFeedback();
    } catch (error) {
      alert('Failed to moderate feedback');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`${API_BASE}/admin/users/${userId}`);
        loadUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const verifyUser = async (userId) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}`, { verified: true });
      loadUsers();
    } catch (error) {
      alert('Failed to verify user');
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Admin Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('users')}>User Management</a></li>
          <li><a onClick={() => setActiveSection('analytics')}>Analytics</a></li>
          <li><a onClick={() => setActiveSection('feedback')}>Feedback</a></li>
        </ul>
        <button className="btn danger" onClick={onLogout}>Logout</button>
      </div>
      
      <div className="main-content">
        {activeSection === 'users' && (
          <div>
            <h2>User Management</h2>
            <button className="btn" onClick={loadUsers}>Refresh</button>
            <div>
              {users.map(user => (
                <div key={user.id} className="app-card">
                  <div className="app-header">
                    <h3>{user.name}</h3>
                    <span className={`status ${user.verified ? 'approved' : 'pending'}`}>
                      {user.userType.toUpperCase()}
                    </span>
                  </div>
                  <div className="app-details">
                    <div className="detail-item">
                      <span>Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="detail-item">
                      <span>Status:</span>
                      <span>{user.verified ? 'Verified' : 'Pending'}</span>
                    </div>
                  </div>
                  <div>
                    <button className="btn danger" onClick={() => deleteUser(user.id)}>Delete</button>
                    {!user.verified && (
                      <button className="btn success" onClick={() => verifyUser(user.id)}>Verify</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'analytics' && (
          <div>
            <h2>Platform Analytics</h2>
            <button className="btn" onClick={loadAnalytics}>Refresh</button>
            <div className="analytics-grid">
              <div className="stat-card">
                <h3>Total Applications</h3>
                <div className="stat-number">{analytics.totalApplications || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Approved Loans</h3>
                <div className="stat-number">{analytics.approvedLoans || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <div className="stat-number">{analytics.activeUsers || 0}</div>
              </div>
              <div className="stat-card">
                <h3>Total Volume</h3>
                <div className="stat-number">${((analytics.totalVolume || 0) / 1000000).toFixed(1)}M</div>
              </div>
              <div className="stat-card">
                <h3>Total Repayments</h3>
                <div className="stat-number">${((analytics.totalRepayments || 0) / 1000).toFixed(0)}K</div>
              </div>
            </div>
            
            <div className="chart-container">
              <h3>Monthly Trends</h3>
              <div className="simple-chart">
                {analytics.monthlyData && analytics.monthlyData.map(item => (
                  <div key={item.month} className="chart-bar">
                    <div className="bar" style={{height: `${item.applications * 5}px`}}></div>
                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'feedback' && (
          <div>
            <h2>Feedback Management</h2>
            <button className="btn" onClick={loadFeedback}>Refresh</button>
            <div>
              {feedback.map(fb => (
                <div key={fb.id} className="app-card">
                  <div className="app-header">
                    <h3>User {fb.userId}</h3>
                    <span className={`status ${fb.status}`}>{fb.status.toUpperCase()}</span>
                  </div>
                  <div className="app-details">
                    <div className="detail-item">
                      <span>Message:</span>
                      <span>{fb.message}</span>
                    </div>
                    <div className="detail-item">
                      <span>Rating:</span>
                      <span>{fb.rating}/5</span>
                    </div>
                  </div>
                  <div>
                    <button className="btn success" onClick={() => moderateFeedback(fb.id, 'approved')}>Approve</button>
                    <button className="btn danger" onClick={() => moderateFeedback(fb.id, 'rejected')}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;