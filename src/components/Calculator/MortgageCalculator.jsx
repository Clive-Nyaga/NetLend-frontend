import { useState } from 'react';

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    homePrice: '',
    downPayment: '',
    interestRate: '',
    loanTerm: '30',
    propertyTax: '',
    insurance: ''
  });
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'homePrice' || name === 'downPayment' ? {
        loanAmount: (prev.homePrice || 0) - (name === 'downPayment' ? value : prev.downPayment || 0)
      } : {})
    }));
  };

  const calculatePayment = (e) => {
    e.preventDefault();
    const { homePrice, downPayment, interestRate, loanTerm, propertyTax, insurance } = formData;
    
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                     (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const monthlyTax = propertyTax / 12;
    const monthlyInsurance = insurance / 12;
    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance;
    
    setResults({
      principalInterest: monthlyPI,
      monthlyTax,
      monthlyInsurance,
      totalPayment: totalMonthly,
      totalInterest: (monthlyPI * numPayments) - principal,
      totalCost: monthlyPI * numPayments
    });
  };

  return (
    <div className="container">
      <h2>Advanced Mortgage Calculator</h2>
      <div className="calculator-grid">
        <div className="calc-inputs">
          <form onSubmit={calculatePayment}>
            <div className="form-group">
              <label>Home Price ($)</label>
              <input 
                type="number" 
                name="homePrice"
                value={formData.homePrice}
                onChange={handleChange}
                placeholder="400,000" 
              />
            </div>
            <div className="form-group">
              <label>Down Payment ($)</label>
              <input 
                type="number" 
                name="downPayment"
                value={formData.downPayment}
                onChange={handleChange}
                placeholder="80,000" 
              />
            </div>
            <div className="form-group">
              <label>Loan Amount ($)</label>
              <input 
                type="number" 
                value={formData.homePrice - formData.downPayment || ''}
                readOnly 
              />
            </div>
            <div className="form-group">
              <label>Interest Rate (%)</label>
              <input 
                type="number" 
                name="interestRate"
                value={formData.interestRate}
                onChange={handleChange}
                step="0.01" 
                placeholder="6.5" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Loan Term (years)</label>
              <select name="loanTerm" value={formData.loanTerm} onChange={handleChange}>
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
            <div className="form-group">
              <label>Annual Property Tax ($)</label>
              <input 
                type="number" 
                name="propertyTax"
                value={formData.propertyTax}
                onChange={handleChange}
                placeholder="4,800" 
              />
            </div>
            <div className="form-group">
              <label>Annual Insurance ($)</label>
              <input 
                type="number" 
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                placeholder="1,200" 
              />
            </div>
            <button type="submit" className="btn">Calculate Payment</button>
          </form>
        </div>
        
        <div className="calc-results">
          {results && (
            <>
              <div className="result-card">
                <h3>Monthly Payment Breakdown</h3>
                <div className="payment-breakdown">
                  <div className="payment-item">
                    <span>Principal & Interest:</span>
                    <span>${results.principalInterest?.toFixed(2)}</span>
                  </div>
                  <div className="payment-item">
                    <span>Property Tax:</span>
                    <span>${results.monthlyTax?.toFixed(2)}</span>
                  </div>
                  <div className="payment-item">
                    <span>Insurance:</span>
                    <span>${results.monthlyInsurance?.toFixed(2)}</span>
                  </div>
                  <div className="payment-item total">
                    <span>Total Monthly Payment:</span>
                    <span>${results.totalPayment?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="result-card">
                <h3>Loan Summary</h3>
                <div className="loan-summary">
                  <div className="summary-item">
                    <span>Total Interest Paid:</span>
                    <span>${results.totalInterest?.toFixed(2)}</span>
                  </div>
                  <div className="summary-item">
                    <span>Total Cost of Loan:</span>
                    <span>${results.totalCost?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MortgageCalculator;