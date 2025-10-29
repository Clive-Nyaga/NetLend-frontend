import { useState, useEffect } from 'react';
import api from '../../services/api';

const EligibilityCalculator = ({ user }) => {
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eligibilityResults, setEligibilityResults] = useState(null);

  useEffect(() => {
    if (user && user.user_type === 'homebuyer') {
      loadBuyerProfile();
    }
  }, [user]);

  const loadBuyerProfile = async () => {
    try {
      const profile = await api.getBuyerProfile();
      setBuyerProfile(profile);
      calculateEligibility(profile);
    } catch (error) {
      console.error('Failed to load buyer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEligibility = (profile) => {
    if (!profile) return;

    const monthlyIncome = profile.monthly_income || 0;
    const existingDebts = profile.existing_debts || 0;
    const creditScore = profile.creditworthiness_score || 0;
    const employmentYears = profile.employment_years || 0;
    const downPaymentSaved = profile.down_payment_saved || 0;

    // Calculate debt-to-income ratio
    const dtiRatio = existingDebts / monthlyIncome;
    
    // Calculate maximum affordable monthly payment (28% rule)
    const maxMonthlyPayment = monthlyIncome * 0.28 - existingDebts;
    
    // Calculate maximum loan amount (assuming 12.5% interest, 30 years)
    const interestRate = 0.125 / 12;
    const loanTerm = 30 * 12;
    const maxLoanAmount = maxMonthlyPayment * ((Math.pow(1 + interestRate, loanTerm) - 1) / 
                         (interestRate * Math.pow(1 + interestRate, loanTerm)));
    
    // Maximum home price
    const maxHomePrice = maxLoanAmount + downPaymentSaved;

    // Eligibility scoring
    let eligibilityScore = 0;
    let eligibilityFactors = [];

    // Credit score factor (40% weight)
    if (creditScore >= 80) {
      eligibilityScore += 40;
      eligibilityFactors.push({ factor: 'Excellent Credit Score', score: creditScore, status: 'excellent' });
    } else if (creditScore >= 70) {
      eligibilityScore += 30;
      eligibilityFactors.push({ factor: 'Good Credit Score', score: creditScore, status: 'good' });
    } else if (creditScore >= 60) {
      eligibilityScore += 20;
      eligibilityFactors.push({ factor: 'Fair Credit Score', score: creditScore, status: 'fair' });
    } else {
      eligibilityScore += 10;
      eligibilityFactors.push({ factor: 'Poor Credit Score', score: creditScore, status: 'poor' });
    }

    // DTI ratio factor (30% weight)
    if (dtiRatio <= 0.28) {
      eligibilityScore += 30;
      eligibilityFactors.push({ factor: 'Low Debt-to-Income Ratio', score: `${(dtiRatio * 100).toFixed(1)}%`, status: 'excellent' });
    } else if (dtiRatio <= 0.36) {
      eligibilityScore += 20;
      eligibilityFactors.push({ factor: 'Moderate Debt-to-Income Ratio', score: `${(dtiRatio * 100).toFixed(1)}%`, status: 'good' });
    } else {
      eligibilityScore += 10;
      eligibilityFactors.push({ factor: 'High Debt-to-Income Ratio', score: `${(dtiRatio * 100).toFixed(1)}%`, status: 'poor' });
    }

    // Employment stability factor (20% weight)
    if (employmentYears >= 3) {
      eligibilityScore += 20;
      eligibilityFactors.push({ factor: 'Stable Employment', score: `${employmentYears} years`, status: 'excellent' });
    } else if (employmentYears >= 1) {
      eligibilityScore += 15;
      eligibilityFactors.push({ factor: 'Moderate Employment History', score: `${employmentYears} years`, status: 'good' });
    } else {
      eligibilityScore += 5;
      eligibilityFactors.push({ factor: 'Limited Employment History', score: `${employmentYears} years`, status: 'fair' });
    }

    // Down payment factor (10% weight)
    const downPaymentRatio = downPaymentSaved / maxHomePrice;
    if (downPaymentRatio >= 0.20) {
      eligibilityScore += 10;
      eligibilityFactors.push({ factor: 'Strong Down Payment', score: `${(downPaymentRatio * 100).toFixed(1)}%`, status: 'excellent' });
    } else if (downPaymentRatio >= 0.10) {
      eligibilityScore += 7;
      eligibilityFactors.push({ factor: 'Adequate Down Payment', score: `${(downPaymentRatio * 100).toFixed(1)}%`, status: 'good' });
    } else {
      eligibilityScore += 3;
      eligibilityFactors.push({ factor: 'Low Down Payment', score: `${(downPaymentRatio * 100).toFixed(1)}%`, status: 'fair' });
    }

    // Determine eligibility status
    let eligibilityStatus = 'Not Eligible';
    let eligibilityColor = '#ef4444';
    let recommendations = [];

    if (eligibilityScore >= 80) {
      eligibilityStatus = 'Highly Eligible';
      eligibilityColor = '#10b981';
      recommendations.push('You qualify for the best interest rates');
      recommendations.push('Consider premium properties in your budget');
    } else if (eligibilityScore >= 60) {
      eligibilityStatus = 'Eligible';
      eligibilityColor = '#3b82f6';
      recommendations.push('You qualify for standard mortgage products');
      recommendations.push('Consider improving credit score for better rates');
    } else if (eligibilityScore >= 40) {
      eligibilityStatus = 'Conditionally Eligible';
      eligibilityColor = '#f59e0b';
      recommendations.push('May need co-signer or larger down payment');
      recommendations.push('Focus on improving credit score and reducing debt');
    } else {
      eligibilityStatus = 'Not Eligible';
      eligibilityColor = '#ef4444';
      recommendations.push('Work on improving credit score');
      recommendations.push('Reduce existing debt obligations');
      recommendations.push('Increase savings for down payment');
    }

    setEligibilityResults({
      eligibilityScore,
      eligibilityStatus,
      eligibilityColor,
      eligibilityFactors,
      recommendations,
      maxHomePrice: maxHomePrice.toFixed(0),
      maxLoanAmount: maxLoanAmount.toFixed(0),
      maxMonthlyPayment: maxMonthlyPayment.toFixed(0),
      dtiRatio: (dtiRatio * 100).toFixed(1)
    });
  };

  if (loading) {
    return <div className="calculator-container"><p>Loading your profile...</p></div>;
  }

  if (!buyerProfile) {
    return (
      <div className="calculator-container">
        <div className="calculator-header">
          <h2>Mortgage Eligibility Calculator</h2>
          <p>Complete your buyer profile to see your mortgage eligibility</p>
        </div>
        <div className="no-profile-message">
          <p>Please complete your buyer profile first to calculate your mortgage eligibility.</p>
          <button className="btn btn-primary">Complete Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container">
      <div className="calculator-header">
        <h2>Your Mortgage Eligibility</h2>
        <p>Based on your complete buyer profile</p>
      </div>

      <div className="calculator-content">
        <div className="profile-summary">
          <h3>Profile Summary</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <span className="label">Monthly Income:</span>
              <span className="value">KSH {buyerProfile.monthly_income?.toLocaleString()}</span>
            </div>
            <div className="profile-item">
              <span className="label">Existing Debts:</span>
              <span className="value">KSH {buyerProfile.existing_debts?.toLocaleString()}</span>
            </div>
            <div className="profile-item">
              <span className="label">Credit Score:</span>
              <span className="value">{buyerProfile.creditworthiness_score}/100</span>
            </div>
            <div className="profile-item">
              <span className="label">Employment:</span>
              <span className="value">{buyerProfile.employment_years} years</span>
            </div>
          </div>
        </div>

        {eligibilityResults && (
          <div className="eligibility-results">
            <div className="eligibility-header">
              <h3>Eligibility Assessment</h3>
              <div className="eligibility-score" style={{ color: eligibilityResults.eligibilityColor }}>
                <div className="score-circle">
                  <span className="score-number">{eligibilityResults.eligibilityScore}</span>
                  <span className="score-total">/100</span>
                </div>
                <div className="score-status">{eligibilityResults.eligibilityStatus}</div>
              </div>
            </div>

            <div className="results-grid">
              <div className="result-card primary">
                <h4>Maximum Home Price</h4>
                <div className="result-value">KSH {parseFloat(eligibilityResults.maxHomePrice).toLocaleString()}</div>
              </div>
              <div className="result-card">
                <h4>Maximum Loan Amount</h4>
                <div className="result-value">KSH {parseFloat(eligibilityResults.maxLoanAmount).toLocaleString()}</div>
              </div>
              <div className="result-card">
                <h4>Monthly Payment Capacity</h4>
                <div className="result-value">KSH {parseFloat(eligibilityResults.maxMonthlyPayment).toLocaleString()}</div>
              </div>
              <div className="result-card">
                <h4>Debt-to-Income Ratio</h4>
                <div className="result-value">{eligibilityResults.dtiRatio}%</div>
              </div>
            </div>

            <div className="eligibility-factors">
              <h4>Eligibility Factors</h4>
              <div className="factors-list">
                {eligibilityResults.eligibilityFactors.map((factor, index) => (
                  <div key={index} className={`factor-item ${factor.status}`}>
                    <span className="factor-name">{factor.factor}</span>
                    <span className="factor-score">{factor.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="recommendations">
              <h4>Recommendations</h4>
              <ul>
                {eligibilityResults.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="next-steps">
              <h4>Next Steps</h4>
              <div className="action-buttons">
                <button className="btn btn-primary">View Matching Properties</button>
                <button className="btn btn-secondary">Improve Profile</button>
                <button className="btn btn-secondary" onClick={() => calculateEligibility(buyerProfile)}>
                  Recalculate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityCalculator;