import { useState, useEffect } from 'react';
import api from '../../services/api';
import PropertyListings from './PropertyListings';
import BuyerProfile from './BuyerProfile';
import MyMortgages from './MyMortgages';
import DTICalculator from '../Calculator/DTICalculator';
import '../../styles/netlend.css';

const HomebuyerDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  useEffect(() => {
    if (activeSection === 'applications') {
      loadApplications();
    }
  }, [activeSection]);

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const apps = await api.getBuyerApplications();
      console.log('Buyer applications response:', apps);
      if (apps.length > 0) {
        console.log('First application structure:', apps[0]);
        console.log('Available fields:', Object.keys(apps[0]));
      }
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Homebuyer Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('overview')} className={activeSection === 'overview' ? 'active' : ''}>Overview</a></li>
          <li><a onClick={() => setActiveSection('properties')} className={activeSection === 'properties' ? 'active' : ''}>Browse Properties</a></li>
          <li><a onClick={() => setActiveSection('dti-calculator')} className={activeSection === 'dti-calculator' ? 'active' : ''}>DTI Calculator</a></li>
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
                <button className="btn" onClick={() => setActiveSection('applications')}>View Applications</button>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'properties' && <PropertyListings />}
        
        {activeSection === 'dti-calculator' && <DTICalculator user={user} />}
        
        {activeSection === 'applications' && (
          <div className="section">
            <h2>My Mortgage Applications</h2>
            {loadingApplications ? (
              <p>Loading applications...</p>
            ) : applications.length === 0 ? (
              <div className="no-applications">
                <p>No applications submitted yet.</p>
                <button className="btn" onClick={() => setActiveSection('properties')}>Browse Properties</button>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map((app, index) => (
                  <div key={app.id || index} className="app-card">
                    <h3>Application #{app.id || index + 1}</h3>
                    <p><strong>Property:</strong> {app.property || 'N/A'}</p>
                    <p><strong>Amount:</strong> KSH {app.amount?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Status:</strong> <span className={`status ${app.status?.toLowerCase() || 'pending'}`}>
                      {app.status === 'approved' ? '✅ Approved - Congratulations!' : 
                       app.status === 'rejected' ? '❌ Rejected' : 
                       app.status === 'auto_rejected' ? '🚫 Auto-Rejected (Another application was approved)' :
                       '⏳ Pending Review'}
                    </span></p>
                    <p><strong>Lender:</strong> {app.lender || 'N/A'}</p>
                    <p><strong>Applied:</strong> {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}</p>
                    <div className="app-actions">
                      <button className="btn" onClick={() => alert(`Application Details:\n\nProperty: ${app.property || 'N/A'}\nAmount: KSH ${app.amount?.toLocaleString() || 'N/A'}\nStatus: ${app.status === 'approved' ? 'Approved - Mortgage Active' : app.status === 'rejected' ? 'Rejected by Lender' : app.status === 'auto_rejected' ? 'Auto-Rejected (Another application approved)' : 'Pending Review'}\nLender: ${app.lender || 'N/A'}\nDate: ${app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'N/A'}`)}>View Details</button>
                      {app.status === 'approved' ? (
                        <button className="btn btn-primary" onClick={() => alert(`Mortgage Activated!\n\nYour application has been approved. Check the "My Mortgages" section for payment details and mortgage management.`)}>View Mortgage</button>
                      ) : (
                        <button className="btn btn-secondary" onClick={() => alert(`Contact ${app.lender || 'Lender'}:\n\nYou can reach out to discuss your application #${app.id || index + 1}.\n\nThis feature will be enhanced to include direct messaging.`)}>Contact Lender</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeSection === 'mortgages' && <MyMortgages user={user} />}
        
        {activeSection === 'profile' && <BuyerProfile />}
      </div>
    </div>
  );
};

export default HomebuyerDashboard;