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
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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

  const handleCardClick = (metric) => {
    setSelectedMetric(metric);
    setShowDetails(true);
  };

  const getDetailedData = (metric) => {
    const details = {
      totalLoans: {
        title: 'Total Loans Breakdown',
        data: [
          { label: 'Approved Loans', value: 45, color: '#10b981' },
          { label: 'Pending Applications', value: 12, color: '#f59e0b' },
          { label: 'Rejected Applications', value: 8, color: '#ef4444' }
        ],
        trend: '+15% from last month'
      },
      activeLoans: {
        title: 'Active Loans Details',
        data: [
          { label: 'Current Month', value: 32, color: '#3b82f6' },
          { label: 'Overdue (1-30 days)', value: 3, color: '#f59e0b' },
          { label: 'Overdue (30+ days)', value: 1, color: '#ef4444' }
        ],
        trend: '+8% from last month'
      },
      monthlyRevenue: {
        title: 'Revenue Breakdown',
        data: [
          { label: 'Interest Income', value: 950000, color: '#10b981' },
          { label: 'Processing Fees', value: 200000, color: '#3b82f6' },
          { label: 'Other Charges', value: 100000, color: '#8b5cf6' }
        ],
        trend: '+22% from last month'
      },
      defaultRate: {
        title: 'Default Rate Analysis',
        data: [
          { label: 'Current Rate', value: 2.3, color: '#ef4444' },
          { label: 'Industry Average', value: 4.1, color: '#6b7280' },
          { label: 'Target Rate', value: 2.0, color: '#10b981' }
        ],
        trend: '-0.5% from last month'
      },
      avgInterestRate: {
        title: 'Interest Rate Distribution',
        data: [
          { label: '10-12%', value: 15, color: '#10b981' },
          { label: '12-14%', value: 20, color: '#3b82f6' },
          { label: '14-16%', value: 10, color: '#f59e0b' }
        ],
        trend: 'Stable from last month'
      },
      totalDisbursed: {
        title: 'Disbursement Breakdown',
        data: [
          { label: 'This Month', value: 5200000, color: '#3b82f6' },
          { label: 'Last Month', value: 4800000, color: '#6b7280' },
          { label: 'YTD Total', value: 25000000, color: '#10b981' }
        ],
        trend: '+8.3% from last month'
      }
    };
    return details[metric] || {};
  };

  return (
    <div className="section">
      <h2>Analytics Dashboard</h2>
      
      <div className="analytics-grid">
        <div className="stat-card clickable" onClick={() => handleCardClick('totalLoans')}>
          <h3>Total Loans</h3>
          <div className="stat-number">{analytics.totalLoans}</div>
          <div className="card-hint">Click for details →</div>
        </div>
        
        <div className="stat-card clickable" onClick={() => handleCardClick('activeLoans')}>
          <h3>Active Loans</h3>
          <div className="stat-number">{analytics.activeLoans}</div>
          <div className="card-hint">Click for details →</div>
        </div>
        
        <div className="stat-card clickable" onClick={() => handleCardClick('monthlyRevenue')}>
          <h3>Monthly Revenue</h3>
          <div className="stat-number">KSH {analytics.monthlyRevenue?.toLocaleString()}</div>
          <div className="card-hint">Click for details →</div>
        </div>
        
        <div className="stat-card clickable" onClick={() => handleCardClick('defaultRate')}>
          <h3>Default Rate</h3>
          <div className="stat-number">{analytics.defaultRate}%</div>
          <div className="card-hint">Click for details →</div>
        </div>
        
        <div className="stat-card clickable" onClick={() => handleCardClick('avgInterestRate')}>
          <h3>Avg Interest Rate</h3>
          <div className="stat-number">{analytics.avgInterestRate}%</div>
          <div className="card-hint">Click for details →</div>
        </div>
        
        <div className="stat-card clickable" onClick={() => handleCardClick('totalDisbursed')}>
          <h3>Total Disbursed</h3>
          <div className="stat-number">KSH {analytics.totalDisbursed?.toLocaleString()}</div>
          <div className="card-hint">Click for details →</div>
        </div>
      </div>
      
      {showDetails && selectedMetric && (
        <div className="metric-details">
          <div className="details-header">
            <h3>{getDetailedData(selectedMetric).title}</h3>
            <button className="btn secondary" onClick={() => setShowDetails(false)}>Close</button>
          </div>
          <div className="details-content">
            <div className="trend-indicator">
              <span className="trend">{getDetailedData(selectedMetric).trend}</span>
            </div>
            <div className="details-grid">
              {getDetailedData(selectedMetric).data?.map((item, index) => (
                <div key={index} className="detail-item">
                  <div className="detail-label">{item.label}</div>
                  <div className="detail-value" style={{color: item.color}}>
                    {typeof item.value === 'number' && item.value > 1000 
                      ? `KSH ${item.value.toLocaleString()}` 
                      : item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="analytics-actions">
        <button className="btn">Download PDF Report</button>
        <button className="btn">Download Excel Report</button>
        <button className="btn secondary" onClick={() => setShowDetails(false)}>Reset View</button>
      </div>
    </div>
  );
};

export default Analytics;