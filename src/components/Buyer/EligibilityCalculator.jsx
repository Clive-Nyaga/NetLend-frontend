import { useState } from 'react';

const EligibilityCalculator = () => {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    existingDebt: '',
    loanAmount: '',
    loanTerm: '30',
    interestRate: '12'
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateEligibility = () => {
    const income = parseFloat(formData.monthlyIncome);
    const debt = parseFloat(formData.existingDebt) || 0;
    const loanAmount = parseFloat(formData.loanAmount);
    const term = parseInt(formData.loanTerm);
    const rate = parseFloat(formData.interestRate);

    if (!income || !loanAmount) {
      alert('Please fill in required fields');
      return;
    }

    // Calculate monthly payment
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Calculate debt-to-income ratio
    const totalMonthlyDebt = debt + monthlyPayment;
    const debtToIncomeRatio = (totalMonthlyDebt / income) * 100;

    // Determine eligibility
    let eligible = false;
    let riskLevel = 'High';
    let recommendation = '';

    if (debtToIncomeRatio <= 28) {
      eligible = true;
      riskLevel = 'Low';
      recommendation = 'Excellent! You qualify for the best rates.';
    } else if (debtToIncomeRatio <= 36) {
      eligible = true;
      riskLevel = 'Medium';
      recommendation = 'Good! You qualify but may get higher rates.';
    } else if (debtToIncomeRatio <= 43) {
      eligible = true;
      riskLevel = 'High';
      recommendation = 'Possible approval with higher rates and stricter terms.';
    } else {
      recommendation = 'Consider reducing debt or increasing income before applying.';
    }

    // Calculate maximum affordable loan
    const maxMonthlyPayment = income * 0.28 - debt;
    const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments));

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      debtToIncomeRatio: debtToIncomeRatio.toFixed(1),
      eligible,
      riskLevel,
      recommendation,
      maxLoanAmount: maxLoanAmount.toFixed(2),
      totalInterest: ((monthlyPayment * numPayments) - loanAmount).toFixed(2)
    });
  };

  return (
    <div>
      <h3>Mortgage Eligibility Calculator</h3>
      
      <div className="calculator-grid">
        <div className="calc-inputs">
          <div className="form-group">
            <label>Monthly Income (KSh) *</label>
            <input
              type="number"
              name="monthlyIncome"
              value={formData.monthlyIncome}
              onChange={handleChange}
              placeholder="150000"
            />
          </div>
          
          <div className="form-group">
            <label>Existing Monthly Debt (KSh)</label>
            <input
              type="number"
              name="existingDebt"
              value={formData.existingDebt}
              onChange={handleChange}
              placeholder="20000"
            />
          </div>
          
          <div className="form-group">
            <label>Desired Loan Amount (KSh) *</label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="5000000"
            />
          </div>
          
          <div className="form-group">
            <label>Loan Term (Years)</label>
            <select name="loanTerm" value={formData.loanTerm} onChange={handleChange}>
              <option value="15">15 years</option>
              <option value="20">20 years</option>
              <option value="25">25 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleChange}
              step="0.1"
              placeholder="12.0"
            />
          </div>
          
          <button onClick={calculateEligibility} className="btn">
            Calculate Eligibility
          </button>
        </div>
        
        {result && (
          <div className="calc-results">
            <div className="result-card">
              <h3>Eligibility Result</h3>
              
              <div className={`eligibility-status ${result.eligible ? 'eligible' : 'not-eligible'}`}>
                <h4>{result.eligible ? '✓ ELIGIBLE' : '✗ NOT ELIGIBLE'}</h4>
                <p>Risk Level: <span className={`risk-${result.riskLevel.toLowerCase()}`}>{result.riskLevel}</span></p>
              </div>
              
              <div className="payment-breakdown">
                <div className="payment-item">
                  <span>Monthly Payment:</span>
                  <span>KSh {parseFloat(result.monthlyPayment).toLocaleString()}</span>
                </div>
                <div className="payment-item">
                  <span>Debt-to-Income Ratio:</span>
                  <span>{result.debtToIncomeRatio}%</span>
                </div>
                <div className="payment-item">
                  <span>Total Interest:</span>
                  <span>KSh {parseFloat(result.totalInterest).toLocaleString()}</span>
                </div>
                <div className="payment-item">
                  <span>Max Affordable Loan:</span>
                  <span>KSh {parseFloat(result.maxLoanAmount).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="recommendation">
                <h4>Recommendation:</h4>
                <p>{result.recommendation}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="eligibility-info">
        <h4>How Eligibility is Calculated:</h4>
        <ul>
          <li><strong>Debt-to-Income Ratio ≤ 28%:</strong> Excellent eligibility, best rates</li>
          <li><strong>Debt-to-Income Ratio ≤ 36%:</strong> Good eligibility, standard rates</li>
          <li><strong>Debt-to-Income Ratio ≤ 43%:</strong> Possible approval, higher rates</li>
          <li><strong>Debt-to-Income Ratio 43%:</strong> Unlikely approval</li>
        </ul>
      </div>
    </div>
  );
};

export default EligibilityCalculator;