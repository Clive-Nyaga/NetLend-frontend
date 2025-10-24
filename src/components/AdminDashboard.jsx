import React, { useState, useEffect } from 'react';
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
import api from '../services/api';
import '../styles/netlend.css';

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

function AdminDashboard({ user, onLogout }) {
  return (
    <div className="App">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="logo-placeholder"></div>
          <h1>NetLend Admin</h1>
        </div>
        <div className="nav-links">
          <a onClick={() => window.location.href = '/'}>Back to Main Site</a>
        </div>
      </nav>
      
      <div className="container">
        <AdminContent />
      </div>
    </div>
  );
}

function AdminContent() {
  const [activeSection, setActiveSection] = useState('analytics');
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [applications, setApplications] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', userType: 'homebuyer', verified: false });
  const [showUserForm, setShowUserForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading admin data...');
      
      // Fetch lenders and mortgages data
      const [lendersResponse, mortgagesResponse] = await Promise.all([
        api.getAllLenders(),
        api.getAllMortgages()
      ]);
      
      console.log('Lenders response:', lendersResponse);
      console.log('Mortgages response:', mortgagesResponse);
      
      const lenders = Array.isArray(lendersResponse) ? lendersResponse : lendersResponse.lenders || [];
      const mortgages = Array.isArray(mortgagesResponse) ? mortgagesResponse : mortgagesResponse.properties || mortgagesResponse.mortgages || [];
      
      console.log('Processed lenders:', lenders);
      console.log('Processed mortgages:', mortgages);
      
      // Use lenders data directly
      const usersData = lenders.map(lender => ({
        id: lender.id,
        name: lender.contact_person || lender.name || `Lender ${lender.id}`,
        email: lender.email,
        userType: 'lender',
        verified: true
      }));
      
      console.log('Users data:', usersData);
      setUsers(usersData);
      
      // Calculate analytics from real data
      const totalApplications = mortgages.length;
      const approvedLoans = mortgages.filter(m => m.status === 'approved').length;
      const activeUsers = lenders.length;
      const totalVolume = mortgages.reduce((sum, m) => sum + (parseFloat(m.price_range) || 0), 0);
      
      setAnalytics({
        totalApplications,
        approvedLoans,
        activeUsers,
        totalVolume,
        approvalRate: totalApplications > 0 ? Math.round((approvedLoans / totalApplications) * 100) : 0,
        totalRepayments: totalVolume * 0.3, // Estimated
        monthlyData: [
          { month: 'Jan', applications: Math.floor(totalApplications * 0.3), approvals: Math.floor(approvedLoans * 0.3) },
          { month: 'Feb', applications: Math.floor(totalApplications * 0.4), approvals: Math.floor(approvedLoans * 0.4) },
          { month: 'Mar', applications: Math.floor(totalApplications * 0.3), approvals: Math.floor(approvedLoans * 0.3) }
        ],
        userGrowth: [
          { month: 'Jan', homebuyers: Math.floor(activeUsers * 0.3), lenders: Math.floor(lenders.length * 0.3) },
          { month: 'Feb', homebuyers: Math.floor(activeUsers * 0.4), lenders: Math.floor(lenders.length * 0.4) },
          { month: 'Mar', homebuyers: Math.floor(activeUsers * 0.3), lenders: Math.floor(lenders.length * 0.3) }
        ]
      });
      
      // Set applications data (mortgages)
      setApplications(mortgages.map(mortgage => ({
        id: mortgage.id,
        applicantName: mortgage.title || `Property ${mortgage.id}`,
        amount: parseFloat(mortgage.price_range) || 0,
        status: mortgage.status || 'pending'
      })));
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Show error message to user
      alert('Failed to load admin data. Please check if the backend is running.');
      // Fallback to empty arrays if API fails
      setUsers([]);
      setAnalytics({ totalApplications: 0, approvedLoans: 0, activeUsers: 0, totalVolume: 0, approvalRate: 0, totalRepayments: 0, monthlyData: [], userGrowth: [] });
      setApplications([]);
    }
  };

  const renderAnalytics = () => (
    <div className="section">
      <h2>Platform Analytics</h2>
      <div className="properties-grid">
        <div className="property-card">
          <div className="property-info">
            <h3>Total Applications</h3>
            <div className="price">{analytics.totalApplications || 0}</div>
          </div>
        </div>
        <div className="property-card">
          <div className="property-info">
            <h3>Approved Loans</h3>
            <div className="price">{analytics.approvedLoans || 0}</div>
          </div>
        </div>
        <div className="property-card">
          <div className="property-info">
            <h3>Active Users</h3>
            <div className="price">{analytics.activeUsers || 0}</div>
          </div>
        </div>
        <div className="property-card">
          <div className="property-info">
            <h3>Total Volume</h3>
            <div className="price">KSh {((analytics.totalVolume || 0) / 1000000).toFixed(1)}M</div>
          </div>
        </div>
        <div className="property-card">
          <div className="property-info">
            <h3>Approval Rate</h3>
            <div className="price">{analytics.approvalRate || 0}%</div>
          </div>
        </div>
        <div className="property-card">
          <div className="property-info">
            <h3>Total Repayments</h3>
            <div className="price">KSh {((analytics.totalRepayments || 0) / 1000).toFixed(0)}K</div>
          </div>
        </div>
      </div>
      
      <div className="properties-grid" style={{marginTop: '3rem'}}>
        <div className="property-card">
          <div className="property-info">
            <h3>Monthly Applications & Approvals</h3>
            <div style={{height: '300px', padding: '1rem'}}>
              <Bar
                data={{
                  labels: (analytics.monthlyData || []).map(d => d.month),
                  datasets: [
                    {
                      label: 'Applications',
                      data: (analytics.monthlyData || []).map(d => d.applications),
                      backgroundColor: 'rgba(26, 54, 93, 0.6)',
                      borderColor: 'rgba(26, 54, 93, 1)',
                      borderWidth: 1
                    },
                    {
                      label: 'Approvals',
                      data: (analytics.monthlyData || []).map(d => d.approvals),
                      backgroundColor: 'rgba(43, 108, 176, 0.6)',
                      borderColor: 'rgba(43, 108, 176, 1)',
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
        </div>
        
        <div className="property-card">
          <div className="property-info">
            <h3>User Growth Trend</h3>
            <div style={{height: '300px', padding: '1rem'}}>
              <Line
                data={{
                  labels: (analytics.userGrowth || []).map(d => d.month),
                  datasets: [
                    {
                      label: 'Homebuyers',
                      data: (analytics.userGrowth || []).map(d => d.homebuyers),
                      borderColor: 'rgb(26, 54, 93)',
                      backgroundColor: 'rgba(26, 54, 93, 0.2)',
                      tension: 0.1
                    },
                    {
                      label: 'Lenders',
                      data: (analytics.userGrowth || []).map(d => d.lenders),
                      borderColor: 'rgb(43, 108, 176)',
                      backgroundColor: 'rgba(43, 108, 176, 0.2)',
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
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="section">
      <h2>User Management</h2>
      <button className="btn" onClick={() => setShowUserForm(!showUserForm)}>
        {showUserForm ? 'Cancel' : 'Add User'}
      </button>
      
      {showUserForm && (
        <div className="property-card" style={{marginTop: '2rem'}}>
          <div className="property-info">
            <h3>Add New User</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              console.log('Create user:', newUser);
              setShowUserForm(false);
            }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>User Type</label>
                <select
                  value={newUser.userType}
                  onChange={(e) => setNewUser({...newUser, userType: e.target.value})}
                >
                  <option value="homebuyer">Homebuyer</option>
                  <option value="lender">Lender</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn">Create User</button>
            </form>
          </div>
        </div>
      )}
      
      <div className="properties-grid" style={{marginTop: '2rem'}}>
        {users.map((user, index) => (
          <div key={index} className="property-card">
            <div className="property-info">
              <h3>{user.name}</h3>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Type:</strong> {user.userType}</p>
              <p><strong>Status:</strong> {user.verified ? 'Verified' : 'Pending'}</p>
              <div style={{marginTop: '1rem'}}>
                {!user.verified && (
                  <button className="btn success" style={{marginRight: '0.5rem'}}>
                    Verify
                  </button>
                )}
                <button className="btn danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="section">
      <h2>Mortgage Applications</h2>
      <div className="properties-grid">
        {applications.map((app, index) => (
          <div key={index} className="property-card">
            <div className="property-info">
              <h3>Application #{app.id}</h3>
              <p><strong>Applicant:</strong> {app.applicantName}</p>
              <p><strong>Amount:</strong> KSh {app.amount?.toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status ${app.status}`}>{app.status}</span></p>
              <div style={{marginTop: '1rem'}}>
                <button className="btn success" style={{marginRight: '0.5rem'}}>
                  Approve
                </button>
                <button className="btn danger">Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="nav-tabs">
        <a 
          className={activeSection === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveSection('analytics')}
        >
          Analytics
        </a>
        <a 
          className={activeSection === 'users' ? 'active' : ''} 
          onClick={() => setActiveSection('users')}
        >
          Users
        </a>
        <a 
          className={activeSection === 'applications' ? 'active' : ''} 
          onClick={() => setActiveSection('applications')}
        >
          Applications
        </a>
      </div>
      
      <div className="tab-content">
        {activeSection === 'analytics' && renderAnalytics()}
        {activeSection === 'users' && renderUsers()}
        {activeSection === 'applications' && renderApplications()}
      </div>
    </>
  );
}

export default AdminDashboard;