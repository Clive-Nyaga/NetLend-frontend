import { useState } from 'react';

const LoanComparison = () => {
  const [loanData, setLoanData] = useState({
    loanAmount: '',
    loan1: { rate: '', term: '30', name: 'Loan Option 1' },
    loan2: { rate: '', term: '30', name: 'Loan Option 2' },
    loan3: { rate: '', term: '30', name: 'Loan Option 3' }
  });
  
  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'loanAmount') {
      setLoanData(prev => ({ ...prev, [name]: value }));
    } else {
      const [loanKey, field] = name.split('.');
      setLoanData(prev => ({
        ...prev,
        [loanKey]: { ...prev[loanKey], [field]: value }
      }));
    }
  };

  const calculateLoan = (principal, rate, term) => {
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;
    
    if (rate === 0) {
      return {
        monthlyPayment: principal / numberOfPayments,
        totalPayment: principal,
        totalInterest: 0
      };
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;
    
    return {
      monthlyPayment,
      totalPayment,
      totalInterest
    };
  };

  const compareLoan = (e) => {
    e.preventDefault();
    
    const principal = parseFloat(loanData.loanAmount);
    
    const loan1Results = calculateLoan(principal, parseFloat(loanData.loan1.rate), parseFloat(loanData.loan1.term));
    const loan2Results = calculateLoan(principal, parseFloat(loanData.loan2.rate), parseFloat(loanData.loan2.term));
    const loan3Results = calculateLoan(principal, parseFloat(loanData.loan3.rate), parseFloat(loanData.loan3.term));
    
    // Find the best option (lowest total payment)
    const loans = [
      { ...loan1Results, ...loanData.loan1, id: 'loan1' },
      { ...loan2Results, ...loanData.loan2, id: 'loan2' },
      { ...loan3Results, ...loanData.loan3, id: 'loan3' }
    ];
    
    const bestLoan = loans.reduce((best, current) => 
      current.totalPayment < best.totalPayment ? current : best
    );
    
    setResults({
      loan1: { ...loan1Results, ...loanData.loan1 },
      loan2: { ...loan2Results, ...loanData.loan2 },
      loan3: { ...loan3Results, ...loanData.loan3 },
      bestOption: bestLoan.id,
      savings: Math.max(...loans.map(l => l.totalPayment)) - bestLoan.totalPayment
    });
  };

  const formatCurrency = (amount) => {
    return `KSH ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Loan Comparison Tool</h2>
        <p>Compare up to 3 different loan options to find the best deal</p>
      </div>
      
      <div className="calculator-content">
        <form onSubmit={compareLoan} className="calculator-form">
          <div className="form-group">
            <label>Loan Amount (KSH)</label>
            <input
              type="number"
              name="loanAmount"
              value={loanData.loanAmount}
              onChange={handleInputChange}
              placeholder="4,000,000"
              required
            />
          </div>
          
          <div className="loan-options">
            {['loan1', 'loan2', 'loan3'].map((loanKey, index) => (
              <div key={loanKey} className="loan-option-card">
                <h4>Loan Option {index + 1}</h4>
                
                <div className="form-group">
                  <label>Lender Name</label>
                  <input
                    type="text"
                    name={`${loanKey}.name`}
                    value={loanData[loanKey].name}
                    onChange={handleInputChange}
                    placeholder={`Lender ${index + 1}`}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      name={`${loanKey}.rate`}
                      value={loanData[loanKey].rate}
                      onChange={handleInputChange}
                      placeholder="12.5"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Term (Years)</label>
                    <select
                      name={`${loanKey}.term`}
                      value={loanData[loanKey].term}
                      onChange={handleInputChange}
                    >
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="25">25 years</option>
                      <option value="30">30 years</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button type="submit" className="btn btn-primary calculate-btn">
            Compare Loans
          </button>
        </form>
        
        {results && (
          <div className="results-section">
            <h3>Loan Comparison Results</h3>
            
            <div className="comparison-grid">
              {['loan1', 'loan2', 'loan3'].map((loanKey, index) => {
                const loan = results[loanKey];
                const isBest = results.bestOption === loanKey;
                
                return (
                  <div key={loanKey} className={`comparison-card ${isBest ? 'best-option' : ''}`}>
                    {isBest && <div className="best-badge">Best Option</div>}
                    <h4>{loan.name}</h4>
                    
                    <div className="loan-details">
                      <div className="detail-row">
                        <span>Interest Rate:</span>
                        <span>{loan.rate}%</span>
                      </div>
                      <div className="detail-row">
                        <span>Term:</span>
                        <span>{loan.term} years</span>
                      </div>
                      <div className="detail-row">
                        <span>Monthly Payment:</span>
                        <span className="highlight">{formatCurrency(loan.monthlyPayment)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Total Interest:</span>
                        <span>{formatCurrency(loan.totalInterest)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Total Payment:</span>
                        <span className="total">{formatCurrency(loan.totalPayment)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="comparison-summary">
              <h4>Summary</h4>
              <p>
                The best option is <strong>{results[results.bestOption].name}</strong> with the lowest total cost.
              </p>
              {results.savings > 0 && (
                <p>
                  You could save <strong>{formatCurrency(results.savings)}</strong> by choosing the best option 
                  over the most expensive one.
                </p>
              )}
            </div>
            
            <div className="comparison-table">
              <h4>Side-by-Side Comparison</h4>
              <table>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>{results.loan1.name}</th>
                    <th>{results.loan2.name}</th>
                    <th>{results.loan3.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Interest Rate</td>
                    <td>{results.loan1.rate}%</td>
                    <td>{results.loan2.rate}%</td>
                    <td>{results.loan3.rate}%</td>
                  </tr>
                  <tr>
                    <td>Loan Term</td>
                    <td>{results.loan1.term} years</td>
                    <td>{results.loan2.term} years</td>
                    <td>{results.loan3.term} years</td>
                  </tr>
                  <tr>
                    <td>Monthly Payment</td>
                    <td>{formatCurrency(results.loan1.monthlyPayment)}</td>
                    <td>{formatCurrency(results.loan2.monthlyPayment)}</td>
                    <td>{formatCurrency(results.loan3.monthlyPayment)}</td>
                  </tr>
                  <tr>
                    <td>Total Interest</td>
                    <td>{formatCurrency(results.loan1.totalInterest)}</td>
                    <td>{formatCurrency(results.loan2.totalInterest)}</td>
                    <td>{formatCurrency(results.loan3.totalInterest)}</td>
                  </tr>
                  <tr className="total-row">
                    <td><strong>Total Cost</strong></td>
                    <td><strong>{formatCurrency(results.loan1.totalPayment)}</strong></td>
                    <td><strong>{formatCurrency(results.loan2.totalPayment)}</strong></td>
                    <td><strong>{formatCurrency(results.loan3.totalPayment)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanComparison;