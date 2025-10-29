import { useState, useEffect } from 'react';
import api from '../../services/api';

const SoldMortgages = ({ lenderId }) => {
  const [soldMortgages, setSoldMortgages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSoldMortgages();
  }, [lenderId]);

  const loadSoldMortgages = async () => {
    try {
      console.log('Loading sold mortgages for lender:', lenderId);
      const response = await api.getLenderApplications(lenderId);
      console.log('Sold mortgages response:', response);
      const apps = Array.isArray(response) ? response : response.applications || [];
      const soldApps = apps.filter(app => app.status === 'approved');
      console.log('Filtered sold mortgages:', soldApps);
      setSoldMortgages(soldApps);
    } catch (error) {
      console.error('Failed to load sold mortgages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <h2>Sold Mortgages</h2>
      
      <div className="sold-mortgages-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <h4>Total Sold</h4>
            <span>{soldMortgages.length}</span>
          </div>
          <div className="stat-item">
            <h4>Total Value</h4>
            <span>KSH {soldMortgages.reduce((sum, m) => sum + (m.amount || 0), 0).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <h4>Approved Applications</h4>
            <span>{soldMortgages.length}</span>
          </div>
        </div>
      </div>

      <div className="sold-mortgages-list">
        {loading ? (
          <p>Loading sold mortgages...</p>
        ) : soldMortgages.length === 0 ? (
          <div className="no-sold-mortgages">
            <h3>No Sold Mortgages Yet</h3>
            <p>Your completed mortgage sales will appear here</p>
          </div>
        ) : (
          soldMortgages.map(mortgage => (
            <div key={mortgage.id} className="sold-mortgage-card">
              <div className="mortgage-header">
                <h3>{mortgage.property || `Application #${mortgage.id}`}</h3>
                <span className="status completed">Approved</span>
              </div>
              
              <div className="mortgage-details">
                <div className="detail-row">
                  <span className="label">Borrower:</span>
                  <span className="value">{mortgage.applicantName || mortgage.applicant || mortgage.buyerName || mortgage.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Loan Amount:</span>
                  <span className="value">KSH {mortgage.amount?.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Property:</span>
                  <span className="value">{mortgage.property}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Notes:</span>
                  <span className="value">{mortgage.notes || 'No additional notes'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status:</span>
                  <span className="value">{mortgage.status}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Application Date:</span>
                  <span className="value">{mortgage.submittedAt}</span>
                </div>
              </div>
              
              <div className="mortgage-actions">
                <button className="btn secondary">View Details</button>
                <button className="btn">Download Contract</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SoldMortgages;