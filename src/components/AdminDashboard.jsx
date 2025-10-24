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
  const [properties, setProperties] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', userType: 'homebuyer', verified: false });
  const [showUserForm, setShowUserForm] = useState(false);
  const [filters, setFilters] = useState({
    userType: 'all',
    appStatus: 'all',
    propLocation: 'all',
    propPriceMax: '',
    propBedroomsMin: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, analyticsRes, feedbackRes, productsRes, appsRes, propsRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/users`),
        axios.get(`${API_BASE}/admin/analytics`),
        axios.get(`${API_BASE}/admin/feedback`),
        axios.get(`${API_BASE}/admin/mortgage-products`),
        axios.get(`${API_BASE}/admin/applications`),
        axios.get(`${API_BASE}/admin/properties`)
      ]);
      setUsers(usersRes.data || []);
      setAnalytics(analyticsRes.data || {});
      setFeedback(feedbackRes.data || []);
      setMortgageProducts(productsRes.data || []);
      setApplications(appsRes.data || []);
      setProperties(propsRes.data || []);
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

  const renderAnalytics = () => {
    const propData = analytics.properties || {};
    const locationData = propData.byLocation || {};
    const locations = Object.keys(locationData);
    
    return (
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
      
      <h3 style={{marginTop: '2rem'}}>Property Analytics</h3>
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Total Properties</h3>
          <div className="stat-number">{propData.total || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Available</h3>
          <div className="stat-number">{propData.available || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Sold</h3>
          <div className="stat-number">{propData.sold || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Value</h3>
          <div className="stat-number">KSh {((propData.totalValue || 0) / 1000000).toFixed(1)}M</div>
        </div>
        <div className="stat-card">
          <h3>Avg Price</h3>
          <div className="stat-number">KSh {((propData.avgPrice || 0) / 1000000).toFixed(1)}M</div>
        </div>
        <div className="stat-card">
          <h3>Total Views</h3>
          <div className="stat-number">{propData.totalViews || 0}</div>
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
        
        <div className="chart-card">
          <h3>Property Listings & Sales</h3>
          <div style={{height: '300px'}}>
            <Bar
              data={{
                labels: (propData.trends || []).map(d => d.month),
                datasets: [
                  {
                    label: 'Listed',
                    data: (propData.trends || []).map(d => d.listed),
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                  },
                  {
                    label: 'Sold',
                    data: (propData.trends || []).map(d => d.sold),
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
          <h3>Property Views Trend</h3>
          <div style={{height: '300px'}}>
            <Line
              data={{
                labels: (propData.trends || []).map(d => d.month),
                datasets: [
                  {
                    label: 'Views',
                    data: (propData.trends || []).map(d => d.views),
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    tension: 0.4
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
          <h3>Properties by Location</h3>
          <div style={{height: '300px'}}>
            <Doughnut
              data={{
                labels: locations,
                datasets: [{
                  data: locations.map(loc => locationData[loc].count),
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)'
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
        
        <div className="chart-card">
          <h3>Avg Property Price by Location</h3>
          <div style={{height: '300px'}}>
            <Bar
              data={{
                labels: locations,
                datasets: [
                  {
                    label: 'Avg Price (KSh M)',
                    data: locations.map(loc => (locationData[loc].avgPrice / 1000000).toFixed(1)),
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
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
          <h3>Property Status</h3>
          <div style={{height: '300px'}}>
            <Doughnut
              data={{
                labels: ['Available', 'Sold', 'Pending'],
                datasets: [{
                  data: [
                    propData.available || 0,
                    propData.sold || 0,
                    propData.pending || 0
                  ],
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
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
  };

  const renderUsers = () => {
    const filteredUsers = users.filter(u => 
      filters.userType === 'all' || u.userType === filters.userType
    );
    
    return (
    <div className="section">
      <div className="section-header">
        <h2>User Management</h2>
        <button className="btn" onClick={() => setShowUserForm(!showUserForm)}>
          {showUserForm ? 'Cancel' : 'Add User'}
        </button>
      </div>
      
      <div className="filter-bar" style={{marginBottom: '1rem'}}>
        <label>
          Filter by Type:
          <select value={filters.userType} onChange={(e) => setFilters({...filters, userType: e.target.value})}>
            <option value="all">All Users</option>
            <option value="homebuyer">Homebuyers</option>
            <option value="lender">Lenders</option>
            <option value="admin">Admins</option>
          </select>
        </label>
        <span style={{marginLeft: '1rem', color: 'var(--text-secondary)'}}>Showing {filteredUsers.length} of {users.length} users</span>
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
        {filteredUsers.map(user => (
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
  };

  const renderMortgageOversight = () => {
    const filteredApps = applications.filter(a => 
      filters.appStatus === 'all' || a.status === filters.appStatus
    );
    
    return (
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
        <div className="filter-bar" style={{marginBottom: '1rem'}}>
          <label>
            Filter by Status:
            <select value={filters.appStatus} onChange={(e) => setFilters({...filters, appStatus: e.target.value})}>
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <span style={{marginLeft: '1rem', color: 'var(--text-secondary)'}}>Showing {filteredApps.length} of {applications.length} applications</span>
        </div>
        <div className="applications-list">
          {filteredApps.map(app => (
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
  };

  const renderProperties = () => {
    const filteredProps = properties.filter(p => {
      const locationMatch = filters.propLocation === 'all' || p.location === filters.propLocation;
      const priceMatch = !filters.propPriceMax || p.price <= parseInt(filters.propPriceMax);
      const bedroomsMatch = !filters.propBedroomsMin || p.bedrooms >= parseInt(filters.propBedroomsMin);
      return locationMatch && priceMatch && bedroomsMatch;
    });
    
    const locations = [...new Set(properties.map(p => p.location))];
    
    return (
    <div className="section">
      <h2>Property Management</h2>
      <div className="filter-bar" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem'}}>
        <label>
          Location:
          <select value={filters.propLocation} onChange={(e) => setFilters({...filters, propLocation: e.target.value})}>
            <option value="all">All Locations</option>
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
        </label>
        <label>
          Max Price (KSh):
          <input 
            type="number" 
            placeholder="e.g. 50000000"
            value={filters.propPriceMax}
            onChange={(e) => setFilters({...filters, propPriceMax: e.target.value})}
            style={{width: '150px'}}
          />
        </label>
        <label>
          Min Bedrooms:
          <input 
            type="number" 
            placeholder="e.g. 3"
            value={filters.propBedroomsMin}
            onChange={(e) => setFilters({...filters, propBedroomsMin: e.target.value})}
            style={{width: '80px'}}
          />
        </label>
        <button 
          className="btn" 
          onClick={() => setFilters({...filters, propLocation: 'all', propPriceMax: '', propBedroomsMin: ''})}
          style={{alignSelf: 'flex-end'}}
        >
          Clear Filters
        </button>
        <span style={{alignSelf: 'flex-end', color: 'var(--text-secondary)'}}>Showing {filteredProps.length} of {properties.length} properties</span>
      </div>
      <div className="properties-list">
        {filteredProps.map(prop => (
          <div key={prop.id} className="property-card">
            <h3>{prop.title}</h3>
            <div className="property-details">
              <p><strong>Price:</strong> KSh {prop.price.toLocaleString()}</p>
              <p><strong>Location:</strong> {prop.location}</p>
              <p><strong>Bedrooms:</strong> {prop.bedrooms} | <strong>Bathrooms:</strong> {prop.bathrooms}</p>
              <p><strong>Size:</strong> {prop.sqft} sqft</p>
              <p><strong>Views:</strong> {prop.views}</p>
              <p><strong>Listed:</strong> {prop.listedDate}</p>
              <span className={`status ${prop.status}`}>{prop.status.toUpperCase()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
  };

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
          <li><a onClick={() => setActiveSection('properties')} className={activeSection === 'properties' ? 'active' : ''}>Properties</a></li>
          <li><a onClick={() => setActiveSection('oversight')} className={activeSection === 'oversight' ? 'active' : ''}>Mortgage Oversight</a></li>
          <li><a onClick={() => setActiveSection('feedback')} className={activeSection === 'feedback' ? 'active' : ''}>Feedback</a></li>
          <li><a onClick={onLogout}>Logout</a></li>
        </ul>
      </div>
      <div className="main-content">
        {activeSection === 'analytics' && renderAnalytics()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'properties' && renderProperties()}
        {activeSection === 'oversight' && renderMortgageOversight()}
        {activeSection === 'feedback' && renderFeedback()}
      </div>
    </div>
  );
}

export default AdminDashboard;
