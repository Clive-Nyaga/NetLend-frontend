import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

function HomebuyerDashboard({ user, onLogout }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [preApproval, setPreApproval] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user's mortgage applications, saved properties, etc.
      const [appsRes, propsRes, preApprovalRes] = await Promise.all([
        axios.get(`${API_BASE}/homebuyer/applications`),
        axios.get(`${API_BASE}/homebuyer/saved-properties`),
        axios.get(`${API_BASE}/homebuyer/pre-approval`)
      ]);
      setApplications(appsRes.data || []);
      setSavedProperties(propsRes.data || []);
      setPreApproval(preApprovalRes.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const renderOverview = () => (
    <div className="section">
      <h2>Your Homebuying Journey</h2>
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Active Applications</h3>
          <div className="stat-number">{applications.filter(a => a.status === 'pending').length}</div>
        </div>
        <div className="stat-card">
          <h3>Saved Properties</h3>
          <div className="stat-number">{savedProperties.length}</div>
        </div>
        <div className="stat-card">
          <h3>Pre-Approval Status</h3>
          <div className="stat-number">{preApproval ? 'Approved' : 'Pending'}</div>
        </div>
      </div>
      
      <div className="journey-steps">
        <h3>Next Steps</h3>
        <div className="steps-grid">
          <div className="step-card">
            <h4>1. Get Pre-Approved</h4>
            <p>Secure your mortgage pre-approval to strengthen your offers</p>
            <button className="btn">Start Application</button>
          </div>
          <div className="step-card">
            <h4>2. Browse Properties</h4>
            <p>Explore available properties within your budget</p>
            <button className="btn">View Properties</button>
          </div>
          <div className="step-card">
            <h4>3. Apply for Mortgage</h4>
            <p>Submit your mortgage application for your chosen property</p>
            <button className="btn">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div className="section">
      <h2>My Applications</h2>
      <div className="applications-list">
        {applications.length === 0 ? (
          <div className="no-applications">
            <h3>No Applications Yet</h3>
            <p>Start your homebuying journey by applying for a mortgage</p>
            <button className="btn">Start Application</button>
          </div>
        ) : (
          applications.map(app => (
            <div key={app.id} className="app-card">
              <div className="app-info">
                <h4>Application #{app.id}</h4>
                <p>Property: {app.propertyAddress}</p>
                <p>Loan Amount: KSh {app.loanAmount?.toLocaleString()}</p>
                <p>Lender: {app.lender}</p>
                <p>Submitted: {app.submittedDate}</p>
              </div>
              <span className={`status ${app.status}`}>{app.status.toUpperCase()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSavedProperties = () => (
    <div className="section">
      <h2>Saved Properties</h2>
      <div className="properties-grid">
        {savedProperties.length === 0 ? (
          <div className="no-properties">
            <h3>No Saved Properties</h3>
            <p>Browse and save properties you're interested in</p>
            <button className="btn">Browse Properties</button>
          </div>
        ) : (
          savedProperties.map(prop => (
            <div key={prop.id} className="property-card">
              <h3>{prop.title}</h3>
              <div className="price">KSh {prop.price?.toLocaleString()}</div>
              <p>{prop.location}</p>
              <p>{prop.bedrooms} bed • {prop.bathrooms} bath</p>
              <button className="btn">View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Homebuyer Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('overview')} className={activeSection === 'overview' ? 'active' : ''}>Overview</a></li>
          <li><a onClick={() => setActiveSection('applications')} className={activeSection === 'applications' ? 'active' : ''}>My Applications</a></li>
          <li><a onClick={() => setActiveSection('properties')} className={activeSection === 'properties' ? 'active' : ''}>Saved Properties</a></li>
          <li><a onClick={() => setActiveSection('preapproval')} className={activeSection === 'preapproval' ? 'active' : ''}>Pre-Approval</a></li>
          <li><a onClick={() => setActiveSection('calculator')} className={activeSection === 'calculator' ? 'active' : ''}>Calculators</a></li>
        </ul>
      </div>
      <div className="main-content">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'applications' && renderApplications()}
        {activeSection === 'properties' && renderSavedProperties()}
      </div>
    </div>
  );
}

export default HomebuyerDashboard;