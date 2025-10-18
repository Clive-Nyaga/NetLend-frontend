import { useState } from 'react';

const AffordabilityCalculator = () => {
  const [formData, setFormData] = useState({
    annualIncome: '',
    monthlyDebts: '',
    downPaymentPercent: '20',
    creditScore: 'excellent'
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateAffordability = (e) => {
    e.preventDefault();
    const { annualIncome, monthlyDebts, downPaymentPercent, creditScore } = formData;
    
    const monthlyIncome = annualIncome / 12;
    const maxMonthlyPayment = (monthlyIncome * 0.28) - monthlyDebts;
    
    const rateMap = {
      excellent: 6.0,
      good: 6.5,
      fair: 7.0,
      poor: 8.0
    };
    
    const interestRate = rateMap[creditScore] / 100 / 12;
    const numPayments = 30 * 12;
    
    const maxLoanAmount = maxMonthlyPayment * (Math.pow(1 + interestRate, numPayments) - 1) / 
                         (interestRate * Math.pow(1 + interestRate, numPayments));
    
    const maxHomePrice = maxLoanAmount / (1 - downPaymentPercent / 100);
    const recommendedDown = maxHomePrice * (downPaymentPercent / 100);
    
    setResult({
      maxHomePrice,
      maxMonthlyPayment,
      recommendedDown,
      estimatedRate: rateMap[creditScore]
    });
  };

  return (
    <div className="container">
      <h2>Affordability Calculator</h2>
      
      <form onSubmit={calculateAffordability}>
        <div className="form-row">
          <div className="form-group">
            <label>Annual Income ($)</label>
            <input 
              type="number" 
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              placeholder="75,000" 
              required 
            />
          </div>
          <div className="form-group">
            <label>Monthly Debts ($)</label>
            <input 
              type="number" 
              name="monthlyDebts"
              value={formData.monthlyDebts}
              onChange={handleChange}
              placeholder="500" 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Down Payment (%)</label>
            <input 
              type="number" 
              name="downPaymentPercent"
              value={formData.downPaymentPercent}
              onChange={handleChange}
              placeholder="20" 
              min="0" 
              max="100" 
            />
          </div>
          <div className="form-group">
            <label>Credit Score</label>
            <select name="creditScore" value={formData.creditScore} onChange={handleChange}>
              <option value="excellent">Excellent (740+)</option>
              <option value="good">Good (670-739)</option>
              <option value="fair">Fair (580-669)</option>
              <option value="poor">Poor (Below 580)</option>
            </select>
          </div>
        </div>
        
        <button type="submit" className="btn">Calculate Affordability</button>
      </form>
      
      {result && (
        <div className="affordability-result">
          <h3>You Can Afford</h3>
          <div className="affordability-amount">${result.maxHomePrice?.toLocaleString()}</div>
          <div className="affordability-details">
            <p>Maximum monthly payment: <span>${result.maxMonthlyPayment?.toFixed(2)}</span></p>
            <p>Recommended down payment: <span>${result.recommendedDown?.toLocaleString()}</span></p>
            <p>Estimated interest rate: <span>{result.estimatedRate}%</span></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffordabilityCalculator;