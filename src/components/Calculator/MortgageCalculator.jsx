import { useState } from 'react';

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '30',
    downPayment: '',
    propertyTax: '',
    insurance: '',
    pmi: ''
  });
  
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMortgage = (e) => {
    e.preventDefault();
    
    const principal = parseFloat(formData.loanAmount) - parseFloat(formData.downPayment || 0);
    const monthlyRate = parseFloat(formData.interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(formData.loanTerm) * 12;
    
    // Monthly mortgage payment calculation
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Additional monthly costs
    const monthlyTax = parseFloat(formData.propertyTax || 0) / 12;
    const monthlyInsurance = parseFloat(formData.insurance || 0) / 12;
    const monthlyPMI = parseFloat(formData.pmi || 0);
    
    const totalMonthlyPayment = monthlyPayment + monthlyTax + monthlyInsurance + monthlyPMI;
    const totalInterest = (monthlyPayment * numberOfPayments) - principal;
    const totalCost = principal + totalInterest;
    
    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalMonthlyPayment: totalMonthlyPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalCost: totalCost.toFixed(2),
      principal: principal.toFixed(2)
    });
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Mortgage Calculator</h2>
        <p>Calculate your monthly mortgage payments and total loan costs</p>
      </div>
      
      <div className="calculator-content">
        <form onSubmit={calculateMortgage} className="calculator-form">
          <div className="form-group">
            <label>Home Price (KSH)</label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              placeholder="5,000,000"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Down Payment (KSH)</label>
            <input
              type="number"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleInputChange}
              placeholder="1,000,000"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                placeholder="12.5"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Loan Term (Years)</label>
              <select
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
              >
                <option value="15">15 years</option>
                <option value="20">20 years</option>
                <option value="25">25 years</option>
                <option value="30">30 years</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Annual Property Tax (KSH)</label>
            <input
              type="number"
              name="propertyTax"
              value={formData.propertyTax}
              onChange={handleInputChange}
              placeholder="50,000"
            />
          </div>
          
          <div className="form-group">
            <label>Annual Home Insurance (KSH)</label>
            <input
              type="number"
              name="insurance"
              value={formData.insurance}
              onChange={handleInputChange}
              placeholder="25,000"
            />
          </div>
          
          <div className="form-group">
            <label>Monthly PMI (KSH)</label>
            <input
              type="number"
              name="pmi"
              value={formData.pmi}
              onChange={handleInputChange}
              placeholder="5,000"
            />
          </div>
          
          <button type="submit" className="btn btn-primary calculate-btn">
            Calculate Payment
          </button>
        </form>
        
        {results && (
          <div className="results-section">
            <h3>Calculation Results</h3>
            <div className="results-grid">
              <div className="result-card">
                <h4>Monthly Payment</h4>
                <div className="result-value">KSH {parseFloat(results.monthlyPayment).toLocaleString()}</div>
                <p>Principal & Interest only</p>
              </div>
              
              <div className="result-card">
                <h4>Total Monthly Payment</h4>
                <div className="result-value">KSH {parseFloat(results.totalMonthlyPayment).toLocaleString()}</div>
                <p>Including taxes & insurance</p>
              </div>
              
              <div className="result-card">
                <h4>Total Interest</h4>
                <div className="result-value">KSH {parseFloat(results.totalInterest).toLocaleString()}</div>
                <p>Over life of loan</p>
              </div>
              
              <div className="result-card">
                <h4>Total Cost</h4>
                <div className="result-value">KSH {parseFloat(results.totalCost).toLocaleString()}</div>
                <p>Principal + Interest</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgageCalculator;