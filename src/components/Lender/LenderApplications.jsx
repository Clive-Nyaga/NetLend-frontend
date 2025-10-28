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
              <h3>Application #{app.id}</h3>
              <p>Applicant: {app.applicantName}</p>
              <p>Amount: KSH {app.amount?.toLocaleString()}</p>
              <p>Status: <span className={`status ${app.status}`}>{app.status}</span></p>
              <div>
                <button 
                  className="btn success" 
                  onClick={() => updateStatus(app.id, 'approved')}
                >
                  Approve
                </button>
                <button 
                  className="btn danger" 
                  onClick={() => updateStatus(app.id, 'rejected')}
                >
                  Reject
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