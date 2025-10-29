import { useState, useEffect } from 'react';
import api from '../../services/api';

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
    loadAnalytics();
  }, [lenderId]);

  const loadAnalytics = async () => {
    try {
      console.log('Loading analytics for lender:', lenderId);
      const [applicationsResponse, listingsResponse] = await Promise.all([
        api.getLenderApplications(lenderId),
        api.getLenderListings(lenderId)
      ]);
      
      const applications = Array.isArray(applicationsResponse) ? applicationsResponse : applicationsResponse.applications || [];
      const listings = Array.isArray(listingsResponse) ? listingsResponse : [];
      
      const approvedApps = applications.filter(app => app.status === 'approved');
      const pendingApps = applications.filter(app => app.status === 'pending');
      
      const totalDisbursed = approvedApps.reduce((sum, app) => sum + (app.amount || 0), 0);
      const monthlyRevenue = totalDisbursed * 0.01; // Estimate 1% monthly revenue
      
      setAnalytics({
        totalLoans: applications.length,
        activeLoans: approvedApps.length,
        monthlyRevenue: monthlyRevenue,
        defaultRate: 0, // Would need additional data
        avgInterestRate: 12.5, // Would need property data
        totalDisbursed: totalDisbursed
      });
      
      console.log('Analytics calculated:', {
        totalApplications: applications.length,
        approved: approvedApps.length,
        pending: pendingApps.length,
        totalDisbursed: totalDisbursed
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleCardClick = (metric) => {
    setSelectedMetric(metric);
    setShowDetails(true);
  };

  const getDetailedData = (metric) => {
    const details = {
      totalLoans: {
        title: 'Total Applications Breakdown',
        data: [
          { label: 'Total Applications', value: analytics.totalLoans, color: '#3b82f6' },
          { label: 'Approved Applications', value: analytics.activeLoans, color: '#10b981' },
          { label: 'Pending Applications', value: analytics.totalLoans - analytics.activeLoans, color: '#f59e0b' }
        ],
        trend: 'Based on current data'
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
          { label: 'Estimated Monthly Revenue', value: analytics.monthlyRevenue, color: '#10b981' },
          { label: 'Total Disbursed', value: analytics.totalDisbursed, color: '#3b82f6' },
          { label: 'Active Loans', value: analytics.activeLoans, color: '#8b5cf6' }
        ],
        trend: 'Based on approved applications'
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
        title: 'Disbursement Summary',
        data: [
          { label: 'Total Disbursed', value: analytics.totalDisbursed, color: '#10b981' },
          { label: 'Number of Loans', value: analytics.activeLoans, color: '#3b82f6' },
          { label: 'Average Loan Size', value: analytics.activeLoans > 0 ? Math.round(analytics.totalDisbursed / analytics.activeLoans) : 0, color: '#8b5cf6' }
        ],
        trend: 'Based on approved applications'
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
        <button 
          className="btn" 
          onClick={() => {
            alert('Generating PDF report...\n\nReport would include:\n- Total Loans: ' + analytics.totalLoans + '\n- Active Loans: ' + analytics.activeLoans + '\n- Monthly Revenue: KSH ' + analytics.monthlyRevenue?.toLocaleString() + '\n- Total Disbursed: KSH ' + analytics.totalDisbursed?.toLocaleString());
          }}
        >
          Download PDF Report
        </button>
        <button 
          className="btn" 
          onClick={() => {
            alert('Generating Excel report...\n\nSpreadsheet would contain detailed analytics data for further analysis.');
          }}
        >
          Download Excel Report
        </button>
        <button className="btn secondary" onClick={() => setShowDetails(false)}>Reset View</button>
      </div>
    </div>
  );
};

export default Analytics;