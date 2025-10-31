import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const SoldMortgages = ({ lenderId, user }) => {
  const [soldMortgages, setSoldMortgages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadSoldMortgages();
  }, [lenderId]);

  const loadSoldMortgages = async () => {
    try {
      const response = await api.getSoldMortgages();
      const mortgages = Array.isArray(response) ? response : response.mortgages || [];
      setSoldMortgages(mortgages);
    } catch (error) {
      console.error('Failed to load sold mortgages:', error);
      setSoldMortgages([]);
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
            <span>KSH {soldMortgages.reduce((sum, m) => sum + (m.principalAmount || 0), 0).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <h4>Active Mortgages</h4>
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
                <h3>{mortgage.property || `Mortgage #${mortgage.id}`}</h3>
                <span className="status completed">✅ Active Mortgage</span>
              </div>
              
              <div className="mortgage-details">
                <div className="detail-row">
                  <span className="label">Borrower:</span>
                  <span className="value">{mortgage.buyer || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Principal Amount:</span>
                  <span className="value">KSH {(mortgage.principalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Remaining Balance:</span>
                  <span className="value">KSH {(mortgage.remainingBalance || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Property:</span>
                  <span className="value">{mortgage.property || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Interest Rate:</span>
                  <span className="value">{mortgage.interestRate || 'N/A'}% per annum</span>
                </div>
                <div className="detail-row">
                  <span className="label">Next Payment Due:</span>
                  <span className="value">{mortgage.nextPaymentDue ? new Date(mortgage.nextPaymentDue).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Start Date:</span>
                  <span className="value">{mortgage.startDate ? new Date(mortgage.startDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="mortgage-actions">
                <button 
                  className="btn secondary" 
                  onClick={() => {
                    showToast(`Mortgage Details: ${mortgage.property || 'Property'} - ${mortgage.buyer || 'Borrower'}`, 'info');
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn" 
                  onClick={() => {
                    showToast('Contract generation started - download will begin shortly', 'success');
                  }}
                >
                  Download Contract
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    showToast('Direct messaging feature coming soon!', 'info');
                  }}
                >
                  Contact Borrower
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SoldMortgages;