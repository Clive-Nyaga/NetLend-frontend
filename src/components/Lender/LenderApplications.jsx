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
                    <p><strong>Notes:</strong> {app.notes || 'No additional notes'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Application Details</h5>
                    <p><strong>Loan Amount:</strong> KSH {app.amount?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Application Date:</strong> {app.submittedAt || 'N/A'}</p>
                    <p><strong>Status:</strong> <span className={`status ${app.status}`}>{app.status || 'pending'}</span></p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Additional Information</h5>
                    <p><em>Complete buyer profile information will be available once the buyer completes their full application with financial details.</em></p>
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
                <button className="btn secondary">Request More Info</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LenderApplications;