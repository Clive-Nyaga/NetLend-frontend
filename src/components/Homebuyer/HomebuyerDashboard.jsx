import { useState } from 'react';

import PropertyListings from './PropertyListings';
import BuyerProfile from './BuyerProfile';
import MyMortgages from './MyMortgages';
import '../../styles/netlend.css';

const HomebuyerDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Homebuyer Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('overview')} className={activeSection === 'overview' ? 'active' : ''}>Overview</a></li>
          <li><a onClick={() => setActiveSection('properties')} className={activeSection === 'properties' ? 'active' : ''}>Browse Properties</a></li>

          <li><a onClick={() => setActiveSection('applications')} className={activeSection === 'applications' ? 'active' : ''}>My Applications</a></li>
          <li><a onClick={() => setActiveSection('mortgages')} className={activeSection === 'mortgages' ? 'active' : ''}>My Mortgages</a></li>
          <li><a onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>Profile</a></li>
          <li><a onClick={onLogout}>Logout</a></li>
        </ul>
      </div>
      
      <div className="main-content">
        {activeSection === 'overview' && (
          <div className="section">
            <h2>Welcome to Your Homebuyer Dashboard</h2>
            <div className="overview-cards">
              <div className="overview-card">
                <h3>🏠 Find Your Dream Home</h3>
                <p>Browse available mortgage opportunities and connect with verified lenders across Kenya.</p>
                <button className="btn" onClick={() => setActiveSection('properties')}>Browse Properties</button>
              </div>
              <div className="overview-card">
                <h3>📋 Complete Profile</h3>
                <p>Complete your buyer profile to get personalized mortgage recommendations and eligibility assessment.</p>
                <button className="btn" onClick={() => setActiveSection('profile')}>Complete Profile</button>
              </div>
              <div className="overview-card">
                <h3>📊 Track Progress</h3>
                <p>Monitor your mortgage applications and stay updated on their status.</p>
                <button className="btn" onClick={() => setActiveSection('profile')}>Update Profile</button>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'properties' && <PropertyListings />}

        
        {activeSection === 'applications' && (
          <div className="section">
            <h2>My Mortgage Applications</h2>
            <div className="applications-list">
              <div className="app-card">
                <h3>Application #001</h3>
                <p><strong>Property:</strong> 3BR Apartment, Westlands</p>
                <p><strong>Amount:</strong> KSH 8,500,000</p>
                <p><strong>Status:</strong> <span className="status pending">Under Review</span></p>
                <p><strong>Lender:</strong> Kenya Commercial Bank</p>
                <div className="app-actions">
                  <button className="btn">View Details</button>
                  <button className="btn btn-secondary">Contact Lender</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'mortgages' && <MyMortgages />}
        
        {activeSection === 'profile' && <BuyerProfile />}
      </div>
    </div>
  );
};

export default HomebuyerDashboard;