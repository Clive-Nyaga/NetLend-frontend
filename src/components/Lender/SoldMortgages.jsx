import { useState, useEffect } from 'react';
import api from '../../services/api';

const SoldMortgages = ({ lenderId, user }) => {
  const [soldMortgages, setSoldMortgages] = useState([]);
  const [loading, setLoading] = useState(true);

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
            <span>KSH {soldMortgages.reduce((sum, m) => sum + (m.loan_amount || m.amount || 0), 0).toLocaleString()}</span>
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
                <h3>{mortgage.property_address || mortgage.property || `Mortgage #${mortgage.id}`}</h3>
                <span className="status completed">✅ Active Mortgage</span>
              </div>
              
              <div className="mortgage-details">
                <div className="detail-row">
                  <span className="label">Borrower:</span>
                  <span className="value">{mortgage.buyer_name || mortgage.buyer?.full_name || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Contact:</span>
                  <span className="value">{mortgage.buyer_email || 'N/A'} | {mortgage.buyer_phone || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Loan Amount:</span>
                  <span className="value">KSH {(mortgage.loan_amount || mortgage.amount || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Property:</span>
                  <span className="value">{mortgage.property_address || mortgage.property || 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Interest Rate:</span>
                  <span className="value">{mortgage.interest_rate || 'N/A'}% per annum</span>
                </div>
                <div className="detail-row">
                  <span className="label">Monthly Payment:</span>
                  <span className="value">KSH {(mortgage.monthly_payment || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Start Date:</span>
                  <span className="value">{mortgage.start_date ? new Date(mortgage.start_date).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
              
              <div className="mortgage-actions">
                <button 
                  className="btn secondary" 
                  onClick={() => {
                    alert(`Active Mortgage Details:\n\nProperty: ${mortgage.property_address || 'N/A'}\nBorrower: ${mortgage.buyer_name || 'N/A'}\nEmail: ${mortgage.buyer_email || 'N/A'}\nPhone: ${mortgage.buyer_phone || 'N/A'}\nLoan Amount: KSH ${(mortgage.loan_amount || 0).toLocaleString()}\nInterest Rate: ${mortgage.interest_rate || 'N/A'}%\nMonthly Payment: KSH ${(mortgage.monthly_payment || 0).toLocaleString()}\nStart Date: ${mortgage.start_date ? new Date(mortgage.start_date).toLocaleDateString() : 'N/A'}`);
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn" 
                  onClick={() => {
                    alert(`Contract Generation:\n\nGenerating mortgage contract for:\nProperty: ${mortgage.property_address || 'N/A'}\nBorrower: ${mortgage.buyer_name || 'N/A'}\nAmount: KSH ${(mortgage.loan_amount || 0).toLocaleString()}\nRate: ${mortgage.interest_rate || 'N/A'}%\n\nContract will be downloaded shortly...`);
                  }}
                >
                  Download Contract
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    alert(`Contact Borrower:\n\nBorrower: ${mortgage.buyer_name || 'N/A'}\nEmail: ${mortgage.buyer_email || 'N/A'}\nPhone: ${mortgage.buyer_phone || 'N/A'}\n\nDirect messaging feature coming soon!`);
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