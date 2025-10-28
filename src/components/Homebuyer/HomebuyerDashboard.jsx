import { useState } from 'react';
import MortgageCalculator from '../Calculator/MortgageCalculator';
import AffordabilityCalculator from '../Calculator/AffordabilityCalculator';
import LoanComparison from '../Calculator/LoanComparison';
import PropertyListings from './PropertyListings';
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
          <li><a onClick={() => setActiveSection('mortgage-calculator')} className={activeSection === 'mortgage-calculator' ? 'active' : ''}>Mortgage Calculator</a></li>
          <li><a onClick={() => setActiveSection('affordability-calculator')} className={activeSection === 'affordability-calculator' ? 'active' : ''}>Affordability Calculator</a></li>
          <li><a onClick={() => setActiveSection('loan-comparison')} className={activeSection === 'loan-comparison' ? 'active' : ''}>Loan Comparison</a></li>
          <li><a onClick={() => setActiveSection('applications')} className={activeSection === 'applications' ? 'active' : ''}>My Applications</a></li>
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
                <h3>🧮 Calculate Affordability</h3>
                <p>Use our tools to determine how much house you can afford and compare loan options.</p>
                <button className="btn" onClick={() => setActiveSection('mortgage-calculator')}>Start Calculating</button>
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
        {activeSection === 'mortgage-calculator' && <MortgageCalculator />}
        {activeSection === 'affordability-calculator' && <AffordabilityCalculator />}
        {activeSection === 'loan-comparison' && <LoanComparison />}
        
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
        
        {activeSection === 'profile' && (
          <div className="section">
            <h2>My Profile</h2>
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" />
              </div>
              <div className="form-group">
                <label>Monthly Income (KSH)</label>
                <input type="number" placeholder="Enter your monthly income" />
              </div>
              <button className="btn">Update Profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomebuyerDashboard;