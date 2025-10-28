import { useState, useEffect } from 'react';

const SoldMortgages = ({ lenderId }) => {
  const [soldMortgages, setSoldMortgages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSoldMortgages();
  }, [lenderId]);

  const loadSoldMortgages = async () => {
    try {
      // Mock sold mortgages data
      setSoldMortgages([
        {
          id: 1,
          propertyTitle: '3BR Apartment in Westlands',
          borrowerName: 'John Kamau',
          loanAmount: 8500000,
          interestRate: 12.5,
          soldDate: '2024-01-15',
          propertyValue: 12000000,
          loanTerm: 25,
          status: 'completed'
        },
        {
          id: 2,
          propertyTitle: '4BR Villa in Karen',
          borrowerName: 'Mary Wanjiku',
          loanAmount: 15000000,
          interestRate: 11.8,
          soldDate: '2024-01-10',
          propertyValue: 20000000,
          loanTerm: 30,
          status: 'completed'
        },
        {
          id: 3,
          propertyTitle: '2BR Condo in Kilimani',
          borrowerName: 'Peter Ochieng',
          loanAmount: 6200000,
          interestRate: 13.2,
          soldDate: '2024-01-08',
          propertyValue: 8500000,
          loanTerm: 20,
          status: 'completed'
        }
      ]);
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
            <span>KSH {soldMortgages.reduce((sum, m) => sum + m.loanAmount, 0).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <h4>Avg Interest Rate</h4>
            <span>{(soldMortgages.reduce((sum, m) => sum + m.interestRate, 0) / soldMortgages.length || 0).toFixed(1)}%</span>
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
                <h3>{mortgage.propertyTitle}</h3>
                <span className="status completed">Completed</span>
              </div>
              
              <div className="mortgage-details">
                <div className="detail-row">
                  <span className="label">Borrower:</span>
                  <span className="value">{mortgage.borrowerName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Loan Amount:</span>
                  <span className="value">KSH {mortgage.loanAmount.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Property Value:</span>
                  <span className="value">KSH {mortgage.propertyValue.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Interest Rate:</span>
                  <span className="value">{mortgage.interestRate}%</span>
                </div>
                <div className="detail-row">
                  <span className="label">Loan Term:</span>
                  <span className="value">{mortgage.loanTerm} years</span>
                </div>
                <div className="detail-row">
                  <span className="label">Sold Date:</span>
                  <span className="value">{new Date(mortgage.soldDate).toLocaleDateString()}</span>
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