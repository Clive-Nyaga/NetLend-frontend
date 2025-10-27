import { useState } from 'react';

const AffordabilityCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    monthlyDebts: '',
    downPayment: '',
    interestRate: '12.5',
    loanTerm: '30',
    propertyTax: '1',
    insurance: '0.5',
    debtToIncomeRatio: '28'
  });
  
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateAffordability = (e) => {
    e.preventDefault();
    
    const monthlyIncome = parseFloat(formData.monthlyIncome);
    const monthlyDebts = parseFloat(formData.monthlyDebts || 0);
    const downPayment = parseFloat(formData.downPayment || 0);
    const interestRate = parseFloat(formData.interestRate) / 100 / 12;
    const loanTerm = parseFloat(formData.loanTerm) * 12;
    const dtiRatio = parseFloat(formData.debtToIncomeRatio) / 100;
    
    // Calculate maximum monthly payment based on DTI ratio
    const maxMonthlyPayment = (monthlyIncome * dtiRatio) - monthlyDebts;
    
    // Estimate property tax and insurance as percentage of home value
    const taxRate = parseFloat(formData.propertyTax) / 100 / 12;
    const insuranceRate = parseFloat(formData.insurance) / 100 / 12;
    
    // Calculate maximum loan amount
    // P = M * [(1 + r)^n - 1] / [r * (1 + r)^n]
    const maxLoanAmount = maxMonthlyPayment * ((Math.pow(1 + interestRate, loanTerm) - 1) / 
                         (interestRate * Math.pow(1 + interestRate, loanTerm)));
    
    // Adjust for property tax and insurance
    const adjustedMaxLoan = maxLoanAmount / (1 + taxRate + insuranceRate);
    
    // Maximum home price
    const maxHomePrice = adjustedMaxLoan + downPayment;
    
    // Calculate actual monthly payment components
    const monthlyPI = adjustedMaxLoan * (interestRate * Math.pow(1 + interestRate, loanTerm)) / 
                     (Math.pow(1 + interestRate, loanTerm) - 1);
    const monthlyTaxInsurance = maxHomePrice * (taxRate + insuranceRate);
    const totalMonthlyPayment = monthlyPI + monthlyTaxInsurance;
    
    setResults({
      maxHomePrice: maxHomePrice.toFixed(0),
      maxLoanAmount: adjustedMaxLoan.toFixed(0),
      monthlyPayment: monthlyPI.toFixed(0),
      monthlyTaxInsurance: monthlyTaxInsurance.toFixed(0),
      totalMonthlyPayment: totalMonthlyPayment.toFixed(0),
      remainingIncome: (monthlyIncome - totalMonthlyPayment - monthlyDebts).toFixed(0),
      dtiUsed: ((totalMonthlyPayment + monthlyDebts) / monthlyIncome * 100).toFixed(1)
    });
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Home Affordability Calculator</h2>
        <p>Determine how much house you can afford based on your income and expenses</p>
      </div>
      
      <div className="calculator-content">
        <form onSubmit={calculateAffordability} className="calculator-form">
          <div className="form-group">
            <label>Monthly Gross Income (KSH)</label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleInputChange}
              placeholder="200,000"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Monthly Debt Payments (KSH)</label>
            <input
              type="number"
              name="monthlyDebts"
              value={formData.monthlyDebts}
              onChange={handleInputChange}
              placeholder="15,000"
            />
            <small>Include car loans, credit cards, student loans, etc.</small>
          </div>
          
          <div className="form-group">
            <label>Available Down Payment (KSH)</label>
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
          
          <div className="form-row">
            <div className="form-group">
              <label>Property Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                name="propertyTax"
                value={formData.propertyTax}
                onChange={handleInputChange}
                placeholder="1.0"
              />
            </div>
            
            <div className="form-group">
              <label>Insurance Rate (%)</label>
              <input
                type="number"
                step="0.1"
                name="insurance"
                value={formData.insurance}
                onChange={handleInputChange}
                placeholder="0.5"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Debt-to-Income Ratio (%)</label>
            <select
              name="debtToIncomeRatio"
              value={formData.debtToIncomeRatio}
              onChange={handleInputChange}
            >
              <option value="28">28% (Conservative)</option>
              <option value="31">31% (Moderate)</option>
              <option value="36">36% (Aggressive)</option>
              <option value="43">43% (Maximum FHA)</option>
            </select>
            <small>Recommended maximum percentage of income for housing</small>
          </div>
          
          <button type="submit" className="btn btn-primary calculate-btn">
            Calculate Affordability
          </button>
        </form>
        
        {results && (
          <div className="results-section">
            <h3>Affordability Results</h3>
            <div className="results-grid">
              <div className="result-card primary">
                <h4>Maximum Home Price</h4>
                <div className="result-value">KSH {parseFloat(results.maxHomePrice).toLocaleString()}</div>
                <p>Based on your income and debts</p>
              </div>
              
              <div className="result-card">
                <h4>Maximum Loan Amount</h4>
                <div className="result-value">KSH {parseFloat(results.maxLoanAmount).toLocaleString()}</div>
                <p>After down payment</p>
              </div>
              
              <div className="result-card">
                <h4>Monthly Payment</h4>
                <div className="result-value">KSH {parseFloat(results.monthlyPayment).toLocaleString()}</div>
                <p>Principal & Interest</p>
              </div>
              
              <div className="result-card">
                <h4>Tax & Insurance</h4>
                <div className="result-value">KSH {parseFloat(results.monthlyTaxInsurance).toLocaleString()}</div>
                <p>Monthly estimate</p>
              </div>
              
              <div className="result-card">
                <h4>Total Monthly Payment</h4>
                <div className="result-value">KSH {parseFloat(results.totalMonthlyPayment).toLocaleString()}</div>
                <p>Including all costs</p>
              </div>
              
              <div className="result-card">
                <h4>Remaining Income</h4>
                <div className="result-value">KSH {parseFloat(results.remainingIncome).toLocaleString()}</div>
                <p>After housing & debts</p>
              </div>
            </div>
            
            <div className="affordability-summary">
              <h4>Summary</h4>
              <p>Your debt-to-income ratio would be <strong>{results.dtiUsed}%</strong></p>
              <p>You would have <strong>KSH {parseFloat(results.remainingIncome).toLocaleString()}</strong> remaining for other expenses</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AffordabilityCalculator;