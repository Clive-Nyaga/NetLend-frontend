import { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/dti-calculator.css';

const DTICalculator = ({ user }) => {
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dtiResults, setDtiResults] = useState(null);

  useEffect(() => {
    if (user && user.user_type === 'homebuyer') {
      loadBuyerProfile();
    }
  }, [user]);

  const loadBuyerProfile = async () => {
    try {
      const profile = await api.getBuyerProfile();
      setBuyerProfile(profile);
      calculateDTI(profile);
    } catch (error) {
      console.error('Failed to load buyer profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDTI = (profile) => {
    if (!profile) return;

    const monthlyIncome = profile.monthlyNetIncome || profile.monthlyGrossIncome || 0;
    const monthlyExpenses = profile.monthlyExpenses || 0;
    const monthlyLoanRepayments = profile.monthlyLoanRepayments || 0;
    
    const totalMonthlyDebt = monthlyExpenses + monthlyLoanRepayments;
    const dtiRatio = monthlyIncome > 0 ? (totalMonthlyDebt / monthlyIncome) * 100 : 0;
    
    let dtiStatus = '';
    let dtiColor = '';
    let recommendations = [];
    
    if (dtiRatio <= 28) {
      dtiStatus = 'Excellent';
      dtiColor = '#10b981';
      recommendations.push('You have excellent debt management');
      recommendations.push('You qualify for the best mortgage rates');
      recommendations.push('Consider premium properties in your budget');
    } else if (dtiRatio <= 36) {
      dtiStatus = 'Good';
      dtiColor = '#3b82f6';
      recommendations.push('You have good debt management');
      recommendations.push('You qualify for standard mortgage products');
      recommendations.push('Consider reducing some expenses for better rates');
    } else if (dtiRatio <= 43) {
      dtiStatus = 'Fair';
      dtiColor = '#f59e0b';
      recommendations.push('Your debt ratio is manageable but high');
      recommendations.push('Focus on reducing monthly expenses');
      recommendations.push('Consider a larger down payment');
    } else {
      dtiStatus = 'Poor';
      dtiColor = '#ef4444';
      recommendations.push('Your debt ratio is too high for most lenders');
      recommendations.push('Reduce monthly expenses before applying');
      recommendations.push('Consider debt consolidation options');
    }

    const maxAffordablePayment = monthlyIncome * 0.28 - monthlyLoanRepayments;
    
    setDtiResults({
      dtiRatio: dtiRatio.toFixed(1),
      dtiStatus,
      dtiColor,
      recommendations,
      monthlyIncome,
      totalMonthlyDebt,
      maxAffordablePayment: Math.max(0, maxAffordablePayment)
    });
  };

  if (loading) {
    return <div className="calculator-container"><p>Loading your profile...</p></div>;
  }

  if (!buyerProfile) {
    return (
      <div className="calculator-container">
        <div className="calculator-header">
          <h2>Debt-to-Income Ratio Calculator</h2>
          <p>Complete your buyer profile to calculate your DTI ratio</p>
        </div>
        <div className="no-profile-message">
          <p>Please complete your buyer profile first to calculate your debt-to-income ratio.</p>
          <button className="btn btn-primary">Complete Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="dti-hero">
        <div className="dti-hero-content">
          <h2 className="dti-title">💰 Your Debt-to-Income Analysis</h2>
          <p className="dti-subtitle">Understanding your financial health for mortgage approval</p>
        </div>
        {dtiResults && (
          <div className="dti-score-hero" style={{ background: `linear-gradient(135deg, ${dtiResults.dtiColor}20, ${dtiResults.dtiColor}10)` }}>
            <div className="score-circle-large" style={{ borderColor: dtiResults.dtiColor }}>
              <span className="score-number-large" style={{ color: dtiResults.dtiColor }}>{dtiResults.dtiRatio}</span>
              <span className="score-percent">%</span>
            </div>
            <div className="score-status-large" style={{ color: dtiResults.dtiColor }}>{dtiResults.dtiStatus}</div>
          </div>
        )}
      </div>

      <div className="dti-content">
        <div className="financial-overview">
          <h3 className="section-title">📊 Financial Overview</h3>
          <div className="financial-cards">
            <div className="financial-card income">
              <div className="card-icon">💵</div>
              <div className="card-content">
                <h4>Monthly Income</h4>
                <div className="card-value">KSH {dtiResults?.monthlyIncome?.toLocaleString()}</div>
              </div>
            </div>
            <div className="financial-card expenses">
              <div className="card-icon">🏠</div>
              <div className="card-content">
                <h4>Monthly Expenses</h4>
                <div className="card-value">KSH {(buyerProfile.monthlyExpenses || 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="financial-card loans">
              <div className="card-icon">💳</div>
              <div className="card-content">
                <h4>Loan Payments</h4>
                <div className="card-value">KSH {(buyerProfile.monthlyLoanRepayments || 0).toLocaleString()}</div>
              </div>
            </div>
            <div className="financial-card debt">
              <div className="card-icon">📋</div>
              <div className="card-content">
                <h4>Total Monthly Debt</h4>
                <div className="card-value">KSH {dtiResults?.totalMonthlyDebt?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {dtiResults && (
          <>
            <div className="dti-insights">
              <h3 className="section-title">🎯 Key Insights</h3>
              <div className="insights-grid">
                <div className="insight-card primary" style={{ borderLeft: `4px solid ${dtiResults.dtiColor}` }}>
                  <div className="insight-header">
                    <span className="insight-icon">📈</span>
                    <h4>DTI Ratio</h4>
                  </div>
                  <div className="insight-value" style={{ color: dtiResults.dtiColor }}>{dtiResults.dtiRatio}%</div>
                  <p className="insight-description">
                    {dtiResults.dtiRatio <= 28 ? '🎉 Excellent financial health' : 
                     dtiResults.dtiRatio <= 36 ? '👍 Good financial position' : 
                     dtiResults.dtiRatio <= 43 ? '⚠️ Fair, room for improvement' : '🚨 Needs attention'}
                  </p>
                </div>
                <div className="insight-card">
                  <div className="insight-header">
                    <span className="insight-icon">🏡</span>
                    <h4>Max Mortgage Payment</h4>
                  </div>
                  <div className="insight-value">KSH {dtiResults.maxAffordablePayment?.toLocaleString()}</div>
                  <p className="insight-description">Monthly payment you can comfortably afford</p>
                </div>
                <div className="insight-card">
                  <div className="insight-header">
                    <span className="insight-icon">💰</span>
                    <h4>Available Income</h4>
                  </div>
                  <div className="insight-value">KSH {(dtiResults.monthlyIncome - dtiResults.totalMonthlyDebt).toLocaleString()}</div>
                  <p className="insight-description">Remaining income after obligations</p>
                </div>
              </div>
            </div>

            <div className="dti-guidelines-modern">
              <h3 className="section-title">📋 Industry Guidelines</h3>
              <div className="guidelines-modern">
                <div className={`guideline-modern ${dtiResults.dtiRatio <= 28 ? 'active' : ''}`}>
                  <div className="guideline-indicator excellent"></div>
                  <div className="guideline-content">
                    <div className="guideline-range">≤ 28%</div>
                    <div className="guideline-label">Excellent</div>
                    <div className="guideline-desc">Best rates & terms available</div>
                  </div>
                </div>
                <div className={`guideline-modern ${dtiResults.dtiRatio > 28 && dtiResults.dtiRatio <= 36 ? 'active' : ''}`}>
                  <div className="guideline-indicator good"></div>
                  <div className="guideline-content">
                    <div className="guideline-range">29% - 36%</div>
                    <div className="guideline-label">Good</div>
                    <div className="guideline-desc">Standard approval process</div>
                  </div>
                </div>
                <div className={`guideline-modern ${dtiResults.dtiRatio > 36 && dtiResults.dtiRatio <= 43 ? 'active' : ''}`}>
                  <div className="guideline-indicator fair"></div>
                  <div className="guideline-content">
                    <div className="guideline-range">37% - 43%</div>
                    <div className="guideline-label">Fair</div>
                    <div className="guideline-desc">May need larger down payment</div>
                  </div>
                </div>
                <div className={`guideline-modern ${dtiResults.dtiRatio > 43 ? 'active' : ''}`}>
                  <div className="guideline-indicator poor"></div>
                  <div className="guideline-content">
                    <div className="guideline-range">&gt; 43%</div>
                    <div className="guideline-label">Needs Work</div>
                    <div className="guideline-desc">Difficult to qualify</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="recommendations-modern">
              <h3 className="section-title">💡 Personalized Recommendations</h3>
              <div className="recommendations-cards">
                {dtiResults.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rec-icon">✨</div>
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-section">
              <h3 className="section-title">🚀 Next Steps</h3>
              <div className="action-cards">
                <div className="action-card primary">
                  <h4>🏠 Browse Properties</h4>
                  <p>Find homes within your budget</p>
                  <button className="btn btn-primary">View Properties</button>
                </div>
                <div className="action-card">
                  <h4>📝 Improve Profile</h4>
                  <p>Update your financial information</p>
                  <button className="btn btn-secondary">Update Profile</button>
                </div>
                <div className="action-card">
                  <h4>🔄 Recalculate</h4>
                  <p>Refresh your DTI analysis</p>
                  <button className="btn btn-secondary" onClick={() => calculateDTI(buyerProfile)}>Recalculate</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DTICalculator;