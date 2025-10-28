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
      setApplications(Array.isArray(response) ? response : response.applications || []);
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
                    <h5>Personal Details</h5>
                    <p><strong>Name:</strong> {app.applicantName || app.buyer?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> {app.buyer?.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {app.buyer?.phone || 'N/A'}</p>
                    <p><strong>ID Number:</strong> {app.buyer?.idNumber || 'N/A'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Financial Profile</h5>
                    <p><strong>Monthly Income:</strong> KSH {app.buyer?.monthlyIncome?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Employment:</strong> {app.buyer?.employmentType || 'N/A'}</p>
                    <p><strong>Employer:</strong> {app.buyer?.employer || 'N/A'}</p>
                    <p><strong>Credit Score:</strong> {app.buyer?.creditScore || 'N/A'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Loan Details</h5>
                    <p><strong>Requested Amount:</strong> KSH {app.amount?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Property Value:</strong> KSH {app.propertyValue?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Down Payment:</strong> KSH {app.downPayment?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Loan Term:</strong> {app.loanTerm || 'N/A'} years</p>
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