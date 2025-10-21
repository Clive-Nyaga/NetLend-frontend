import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
          <div className="stat-number">KSh {((analytics.totalVolume || 0) / 1000000).toFixed(1)}M</div>
        </div>
        <div className="stat-card">
          <h3>Approval Rate</h3>
          <div className="stat-number">{analytics.approvalRate || 0}%</div>
        </div>
        <div className="stat-card">
          <h3>Total Repayments</h3>
          <div className="stat-number">KSh {((analytics.totalRepayments || 0) / 1000).toFixed(0)}K</div>
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-card">
          <h3>Monthly Applications & Approvals</h3>
          <div style={{height: '300px'}}>
            <Bar
              data={{
                labels: (analytics.monthlyData || []).map(d => d.month),
                datasets: [
                  {
                    label: 'Applications',
                    data: (analytics.monthlyData || []).map(d => d.applications),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Approvals',
                    data: (analytics.monthlyData || []).map(d => d.approvals),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3>User Growth Trend</h3>
          <div style={{height: '300px'}}>
            <Line
              data={{
                labels: (analytics.userGrowth || []).map(d => d.month),
                datasets: [
                  {
                    label: 'Homebuyers',
                    data: (analytics.userGrowth || []).map(d => d.homebuyers),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                  },
                  {
                    label: 'Lenders',
                    data: (analytics.userGrowth || []).map(d => d.lenders),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.2)',
                    tension: 0.1
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                }
              }}
            />
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Loan Status Distribution</h3>
          <div style={{height: '300px'}}>
            <Doughnut
              data={{
                labels: ['Approved', 'Pending', 'Rejected'],
                datasets: [{
                  data: [
                    analytics.approvedLoans || 0,
                    (analytics.totalApplications || 0) - (analytics.approvedLoans || 0),
                    Math.floor((analytics.totalApplications || 0) * 0.1)
                  ],
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(255, 99, 132, 0.8)'
                  ],
                  borderWidth: 2
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom' },
                  title: { display: false }
                }
              }}
            />
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
                <span>Range: KSh {product.minAmount.toLocaleString()} - KSh {product.maxAmount.toLocaleString()}</span>
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
                <p>Amount: KSh {app.amount.toLocaleString()}</p>
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