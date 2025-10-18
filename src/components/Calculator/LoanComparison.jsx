import { useState } from 'react';

const LoanComparison = () => {
  const [loan1, setLoan1] = useState({
    amount: '',
    rate: '',
    term: '30'
  });
  const [loan2, setLoan2] = useState({
    amount: '',
    rate: '',
    term: '30'
  });
  const [comparison, setComparison] = useState(null);

  const handleLoan1Change = (e) => {
    setLoan1({ ...loan1, [e.target.name]: e.target.value });
  };

  const handleLoan2Change = (e) => {
    setLoan2({ ...loan2, [e.target.name]: e.target.value });
  };

  const calculateLoan = (loanData) => {
    const { amount, rate, term } = loanData;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                          (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return {
      monthlyPayment,
      totalInterest: (monthlyPayment * numPayments) - amount,
      totalCost: monthlyPayment * numPayments
    };
  };

  const compareLoanOptions = () => {
    const result1 = calculateLoan(loan1);
    const result2 = calculateLoan(loan2);
    
    setComparison({
      loan1: result1,
      loan2: result2,
      savings: result1.totalCost - result2.totalCost
    });
  };

  return (
    <div className="container">
      <h2>Loan Comparison Tool</h2>
      
      <div className="comparison-grid">
        <div className="loan-option">
          <h3>Option 1</h3>
          <div className="form-group">
            <label>Loan Amount ($)</label>
            <input 
              type="number" 
              name="amount"
              value={loan1.amount}
              onChange={handleLoan1Change}
              placeholder="300,000" 
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input 
              type="number" 
              name="rate"
              value={loan1.rate}
              onChange={handleLoan1Change}
              step="0.01" 
              placeholder="6.5" 
            />
          </div>
          <div className="form-group">
            <label>Term (years)</label>
            <select name="term" value={loan1.term} onChange={handleLoan1Change}>
              <option value="15">15 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          {comparison && (
            <div className="comparison-result">
              <p>Monthly Payment: ${comparison.loan1.monthlyPayment?.toFixed(2)}</p>
              <p>Total Interest: ${comparison.loan1.totalInterest?.toFixed(2)}</p>
              <p>Total Cost: ${comparison.loan1.totalCost?.toFixed(2)}</p>
            </div>
          )}
        </div>
        
        <div className="loan-option">
          <h3>Option 2</h3>
          <div className="form-group">
            <label>Loan Amount ($)</label>
            <input 
              type="number" 
              name="amount"
              value={loan2.amount}
              onChange={handleLoan2Change}
              placeholder="300,000" 
            />
          </div>
          <div className="form-group">
            <label>Interest Rate (%)</label>
            <input 
              type="number" 
              name="rate"
              value={loan2.rate}
              onChange={handleLoan2Change}
              step="0.01" 
              placeholder="6.0" 
            />
          </div>
          <div className="form-group">
            <label>Term (years)</label>
            <select name="term" value={loan2.term} onChange={handleLoan2Change}>
              <option value="15">15 years</option>
              <option value="30">30 years</option>
            </select>
          </div>
          {comparison && (
            <div className="comparison-result">
              <p>Monthly Payment: ${comparison.loan2.monthlyPayment?.toFixed(2)}</p>
              <p>Total Interest: ${comparison.loan2.totalInterest?.toFixed(2)}</p>
              <p>Total Cost: ${comparison.loan2.totalCost?.toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
      
      <button className="btn" onClick={compareLoanOptions}>Compare Options</button>
      
      {comparison && (
        <div className="comparison-summary">
          <h3>Comparison Summary</h3>
          <p>
            {comparison.savings > 0 
              ? `Option 2 saves $${Math.abs(comparison.savings).toFixed(2)} over the life of the loan`
              : `Option 1 saves $${Math.abs(comparison.savings).toFixed(2)} over the life of the loan`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LoanComparison;