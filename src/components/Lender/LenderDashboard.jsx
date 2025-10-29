import { useState } from 'react';
import MyListings from './MyListings';
import LenderApplications from './LenderApplications';
import SoldMortgages from './SoldMortgages';
import LenderProfile from './LenderProfile';
import Analytics from './Analytics';
import '../../styles/netlend.css';

const LenderDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const showSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Lender Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('overview')} className={activeSection === 'overview' ? 'active' : ''}>Overview</a></li>
          <li><a onClick={() => setActiveSection('listings')} className={activeSection === 'listings' ? 'active' : ''}>My Listings</a></li>
          <li><a onClick={() => setActiveSection('applications')} className={activeSection === 'applications' ? 'active' : ''}>Applications</a></li>
          <li><a onClick={() => setActiveSection('sold')} className={activeSection === 'sold' ? 'active' : ''}>Sold Mortgages</a></li>
          <li><a onClick={() => setActiveSection('analytics')} className={activeSection === 'analytics' ? 'active' : ''}>Analytics</a></li>
          <li><a onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>Profile</a></li>
          <li><a onClick={onLogout}>Logout</a></li>
        </ul>
      </div>
      
      <div className="main-content">
        {activeSection === 'overview' && (
          <div className="section">
            <h2>Welcome to Your Lender Dashboard</h2>
            <div className="overview-cards">
              <div className="overview-card">
                <h3>📋 Manage Listings</h3>
                <p>Create and manage your mortgage listings to attract qualified borrowers across Kenya.</p>
                <button className="btn" onClick={() => setActiveSection('listings')}>View Listings</button>
              </div>
              <div className="overview-card">
                <h3>📄 Review Applications</h3>
                <p>Process mortgage applications with comprehensive buyer profiles and creditworthiness scores.</p>
                <button className="btn" onClick={() => setActiveSection('applications')}>Review Applications</button>
              </div>
              <div className="overview-card">
                <h3>📊 Track Performance</h3>
                <p>Monitor your lending portfolio, revenue, and business analytics in real-time.</p>
                <button className="btn" onClick={() => setActiveSection('analytics')}>View Analytics</button>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'listings' && <MyListings lenderId={user?.id} />}
        {activeSection === 'applications' && <LenderApplications lenderId={user?.id} />}
        {activeSection === 'sold' && <SoldMortgages lenderId={user?.id} />}
        {activeSection === 'analytics' && <Analytics lenderId={user?.id} />}
        {activeSection === 'profile' && <LenderProfile user={user} />}
      </div>
    </div>
  );
};

export default LenderDashboard;