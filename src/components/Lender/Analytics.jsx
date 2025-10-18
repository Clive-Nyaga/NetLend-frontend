import { useState, useEffect } from 'react';

const Analytics = ({ lenderId }) => {
  const [analytics, setAnalytics] = useState({
    totalLoans: 0,
    activeLoans: 0,
    monthlyRevenue: 0,
    defaultRate: 0,
    avgInterestRate: 0,
    totalDisbursed: 0
  });

  useEffect(() => {
    // Mock analytics data
    setAnalytics({
      totalLoans: 45,
      activeLoans: 32,
      monthlyRevenue: 1250000,
      defaultRate: 2.3,
      avgInterestRate: 12.8,
      totalDisbursed: 25000000
    });
  }, [lenderId]);

  return (
    <div className="section">
      <h2>Analytics Dashboard</h2>
      
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Total Loans</h3>
          <div className="stat-number">{analytics.totalLoans}</div>
        </div>
        
        <div className="stat-card">
          <h3>Active Loans</h3>
          <div className="stat-number">{analytics.activeLoans}</div>
        </div>
        
        <div className="stat-card">
          <h3>Monthly Revenue</h3>
          <div className="stat-number">KSH {analytics.monthlyRevenue?.toLocaleString()}</div>
        </div>
        
        <div className="stat-card">
          <h3>Default Rate</h3>
          <div className="stat-number">{analytics.defaultRate}%</div>
        </div>
        
        <div className="stat-card">
          <h3>Avg Interest Rate</h3>
          <div className="stat-number">{analytics.avgInterestRate}%</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Disbursed</h3>
          <div className="stat-number">KSH {analytics.totalDisbursed?.toLocaleString()}</div>
        </div>
      </div>
      
      <div className="analytics-actions">
        <button className="btn">Download PDF Report</button>
        <button className="btn">Download Excel Report</button>
      </div>
    </div>
  );
};

export default Analytics;