import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function AdminDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [feedback, setFeedback] = useState([]);
  const [mortgageProducts, setMortgageProducts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', userType: 'homebuyer', verified: false });
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, analyticsRes, feedbackRes, productsRes, appsRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/users`),
        axios.get(`${API_BASE}/admin/analytics`),
        axios.get(`${API_BASE}/admin/feedback`),
        axios.get(`${API_BASE}/admin/mortgage-products`),
        axios.get(`${API_BASE}/admin/applications`)
      ]);
      setUsers(usersRes.data || []);
      setAnalytics(analyticsRes.data || {});
      setFeedback(feedbackRes.data || []);
      setMortgageProducts(productsRes.data || []);
      setApplications(appsRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load admin data. Please check if backend is running.');
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/admin/users`, newUser);
      setNewUser({ name: '', email: '', userType: 'homebuyer', verified: false });
      setShowUserForm(false);
      loadData();
    } catch (error) {
      alert('Failed to create user');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await axios.delete(`${API_BASE}/admin/users/${userId}`);
        loadData();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  const verifyUser = async (userId) => {
    try {
      await axios.put(`${API_BASE}/admin/users/${userId}`, { verified: true });
      loadData();
    } catch (error) {
      alert('Failed to verify user');
    }
  };

  const moderateFeedback = async (feedbackId, status) => {
    try {
      await axios.put(`${API_BASE}/admin/feedback/${feedbackId}`, { status });
      loadData();
    } catch (error) {
      alert('Failed to moderate feedback');
    }
  };

  const renderAnalytics = () => (
    <div className="section">
      <h2>Platform Analytics</h2>
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
          <h3>Approval Rate</h3>
          <div className="stat-number">{analytics.approvalRate || 0}%</div>
        </div>
        <div className="stat-card">
          <h3>Total Repayments</h3>
          <div className="stat-number">${((analytics.totalRepayments || 0) / 1000).toFixed(0)}K</div>
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-card">
          <h3>Monthly Applications</h3>
          <div className="chart-placeholder">
            {(analytics.monthlyData || []).map(data => (
              <div key={data.month} className="chart-bar">
                <div className="bar" style={{height: `${data.applications * 3}px`, background: 'var(--primary-color)'}}></div>
                <span>{data.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart-card">
          <h3>User Growth</h3>
          <div className="growth-list">
            {(analytics.userGrowth || []).map(data => (
              <div key={data.month} className="growth-item">
                <span>{data.month}: {data.homebuyers} homebuyers, {data.lenders} lenders</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="section">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="btn" onClick={() => setShowUserForm(!showUserForm)}>
          {showUserForm ? 'Cancel' : 'Add User'}
        </button>
      </div>
      
      {showUserForm && (
        <form onSubmit={createUser} className="user-form">
          <div className="form-row">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({...newUser, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              required
            />
          </div>
          <div className="form-row">
            <select
              value={newUser.userType}
              onChange={(e) => setNewUser({...newUser, userType: e.target.value})}
            >
              <option value="homebuyer">Homebuyer</option>
              <option value="lender">Lender</option>
              <option value="admin">Admin</option>
            </select>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={newUser.verified}
                onChange={(e) => setNewUser({...newUser, verified: e.target.checked})}
              />
              Verified
            </label>
          </div>
          <button type="submit" className="btn success">Create User</button>
        </form>
      )}
      
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className="user-type">{user.userType}</span>
              <span className={`status ${user.verified ? 'approved' : 'pending'}`}>
                {user.verified ? 'Verified' : 'Pending'}
              </span>
            </div>
            <div className="user-actions">
              <button 
                className="btn success" 
                onClick={() => verifyUser(user.id)}
                disabled={user.verified}
              >
                Verify
              </button>
              <button 
                className="btn danger" 
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMortgageOversight = () => (
    <div className="section">
      <h2>Mortgage Oversight</h2>
      
      <div className="oversight-section">
        <h3>Mortgage Products</h3>
        <div className="products-grid">
          {mortgageProducts.map(product => (
            <div key={product.id} className="product-card">
              <h4>{product.lender}</h4>
              <div className="product-details">
                <span>Rate: {product.rate}%</span>
                <span>Term: {product.term} years</span>
                <span>Type: {product.type}</span>
                <span>Range: ${product.minAmount.toLocaleString()} - ${product.maxAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="oversight-section">
        <h3>All Applications</h3>
        <div className="applications-list">
          {applications.map(app => (
            <div key={app.id} className="app-card">
              <div className="app-info">
                <h4>Application #{app.id}</h4>
                <p>Lender: {app.lender}</p>
                <p>Applicant: {app.applicant}</p>
                <p>Amount: ${app.amount.toLocaleString()}</p>
                <p>Date: {app.date}</p>
              </div>
              <span className={`status ${app.status}`}>{app.status.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="section">
      <h2>Feedback Management</h2>
      <div className="feedback-list">
        {feedback.map(fb => (
          <div key={fb.id} className="feedback-card">
            <div className="feedback-content">
              <p>{fb.message}</p>
              <div className="feedback-meta">
                <span>Rating: {fb.rating}/5</span>
                <span>Date: {fb.date}</span>
                <span className={`status ${fb.status}`}>{fb.status}</span>
              </div>
            </div>
            <div className="feedback-actions">
              <button 
                className="btn success" 
                onClick={() => moderateFeedback(fb.id, 'approved')}
                disabled={fb.status === 'approved'}
              >
                Approve
              </button>
              <button 
                className="btn danger" 
                onClick={() => moderateFeedback(fb.id, 'rejected')}
                disabled={fb.status === 'rejected'}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Admin Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('analytics')} className={activeSection === 'analytics' ? 'active' : ''}>Analytics</a></li>
          <li><a onClick={() => setActiveSection('users')} className={activeSection === 'users' ? 'active' : ''}>User Management</a></li>
          <li><a onClick={() => setActiveSection('oversight')} className={activeSection === 'oversight' ? 'active' : ''}>Mortgage Oversight</a></li>
          <li><a onClick={() => setActiveSection('feedback')} className={activeSection === 'feedback' ? 'active' : ''}>Feedback</a></li>
          <li><a onClick={onLogout}>Logout</a></li>
        </ul>
      </div>
      <div className="main-content">
        {activeSection === 'analytics' && renderAnalytics()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'oversight' && renderMortgageOversight()}
        {activeSection === 'feedback' && renderFeedback()}
      </div>
    </div>
  );
}

export default AdminDashboard;