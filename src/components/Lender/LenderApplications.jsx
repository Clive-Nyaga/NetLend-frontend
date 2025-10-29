import { useState, useEffect } from 'react';
import api from '../../services/api';

const LenderApplications = ({ lenderId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, [lenderId]);

  const loadApplications = async () => {
    try {
      console.log('Loading applications for lender:', lenderId);
      const response = await api.getLenderApplications(lenderId);
      console.log('Applications response:', response);
      const apps = Array.isArray(response) ? response : response.applications || [];
      if (apps.length > 0) {
        console.log('First application structure:', apps[0]);
        console.log('Application fields:', Object.keys(apps[0]));
        console.log('Full application data:', JSON.stringify(apps[0], null, 2));
        if (apps[0].buyer) {
          console.log('Buyer object:', apps[0].buyer);
          console.log('Buyer fields:', Object.keys(apps[0].buyer));
        } else {
          console.log('No buyer object found in application');
        }
      }
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.updateApplicationStatus(applicationId, status);
      loadApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div id="lenderApplications" className="section">
      <h2>Mortgage Applications</h2>
      <div id="lenderAppsList">
        {loading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <div>
            <p>No applications received yet.</p>
            <p>Debug: Loaded {applications.length} applications</p>
          </div>
        ) : (
          applications.map((app, index) => (
            <div key={index} className="app-card">
              <div className="app-header">
                <h3>Application #{app.id}</h3>
                <span className={`status ${app.status}`}>{app.status}</span>
              </div>
              
              <div className="applicant-details">
                <h4>Buyer Information</h4>
                <div className="buyer-info-grid">
                  <div className="info-section">
                    <h5>Applicant Details</h5>
                    <p><strong>Name:</strong> {app.applicantName || app.applicant || app.buyerName || app.name || 'N/A'}</p>
                    <p><strong>Property:</strong> {app.property || 'N/A'}</p>
                    <p><strong>Email:</strong> {app.buyer_email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {app.buyer_phone || 'N/A'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Financial Profile</h5>
                    <p><strong>Monthly Income:</strong> KSH {(app.monthly_income || 0).toLocaleString()}</p>
                    <p><strong>Employment:</strong> {app.employment_status || 'N/A'}</p>
                    <p><strong>Loan Amount:</strong> KSH {app.amount?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Down Payment:</strong> KSH {app.down_payment?.toLocaleString() || 'N/A'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Assessment & Status</h5>
                    {app.creditworthiness_score && (
                      <p><strong>Credit Score:</strong> <span style={{color: app.creditworthiness_score >= 70 ? '#10b981' : app.creditworthiness_score >= 50 ? '#f59e0b' : '#ef4444'}}>{app.creditworthiness_score}/100</span></p>
                    )}
                    {app.risk_level && (
                      <p><strong>Risk Level:</strong> <span style={{color: app.risk_level === 'Low' ? '#10b981' : app.risk_level === 'Medium' ? '#f59e0b' : '#ef4444'}}>{app.risk_level} Risk</span></p>
                    )}
                    <p><strong>Application Date:</strong> {app.submittedAt || 'N/A'}</p>
                    <p><strong>Status:</strong> <span className={`status ${app.status}`}>{app.status || 'pending'}</span></p>
                  </div>
                </div>
                
                {app.buyer?.documents && (
                  <div className="documents-section">
                    <h5>Submitted Documents</h5>
                    <div className="documents-list">
                      {app.buyer.documents.map((doc, idx) => (
                        <span key={idx} className="document-badge">{doc}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="app-actions">
                <button 
                  className="btn success" 
                  onClick={() => updateStatus(app.id, 'approved')}
                  disabled={app.status === 'approved'}
                >
                  Approve
                </button>
                <button 
                  className="btn danger" 
                  onClick={() => updateStatus(app.id, 'rejected')}
                  disabled={app.status === 'rejected'}
                >
                  Reject
                </button>
                <button 
                  className="btn secondary" 
                  onClick={() => {
                    const message = prompt('What additional information do you need from the applicant?');
                    if (message) {
                      alert(`Information request sent to ${app.applicantName || app.applicant}: "${message}"`);
                    }
                  }}
                >
                  Request More Info
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LenderApplications;