import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const LenderApplications = ({ lenderId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { showToast } = useToast();

  const calculateEligibilityScore = (app) => {
    const monthlyIncome = app.monthly_income || 0;
    const existingDebts = app.existing_debts || 0;
    const creditScore = app.creditworthiness_score || 0;
    const employmentYears = app.employment_years || 0;
    const downPayment = app.down_payment || 0;
    const loanAmount = app.amount || 0;

    let score = 0;
    
    // Credit score (40% weight)
    if (creditScore >= 80) score += 40;
    else if (creditScore >= 70) score += 30;
    else if (creditScore >= 60) score += 20;
    else score += 10;
    
    // DTI ratio (30% weight)
    const dtiRatio = existingDebts / monthlyIncome;
    if (dtiRatio <= 0.28) score += 30;
    else if (dtiRatio <= 0.36) score += 20;
    else score += 10;
    
    // Employment (20% weight)
    if (employmentYears >= 3) score += 20;
    else if (employmentYears >= 1) score += 15;
    else score += 5;
    
    // Down payment ratio (10% weight)
    const downPaymentRatio = downPayment / (loanAmount + downPayment);
    if (downPaymentRatio >= 0.20) score += 10;
    else if (downPaymentRatio >= 0.10) score += 7;
    else score += 3;

    return Math.min(score, 100);
  };

  const getEligibilityStatus = (score) => {
    if (score >= 80) return { status: 'Highly Eligible', color: '#10b981' };
    if (score >= 60) return { status: 'Eligible', color: '#3b82f6' };
    if (score >= 40) return { status: 'Conditionally Eligible', color: '#f59e0b' };
    return { status: 'Not Eligible', color: '#ef4444' };
  };

  useEffect(() => {
    loadApplications();
  }, [lenderId]);

  const loadApplications = async () => {
    try {
      const response = await api.getLenderApplications(lenderId);
      console.log('Lender Applications API Response:', response);
      if (response && response.length > 0) {
        console.log('First application fields:', Object.keys(response[0]));
        console.log('Sample application data:', JSON.stringify(response[0], null, 2));
      }
      const apps = Array.isArray(response) ? response : response.applications || [];
      setApplications(apps);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status, app) => {
    if (status === 'approved') {
      const confirmed = window.confirm(
        `Approve Application #${applicationId}?\n\n` +
        `Property: ${app.property || 'N/A'}\n` +
        `Applicant: ${app.buyer?.full_name || app.applicant || 'N/A'}\n` +
        `Amount: KSH ${app.amount?.toLocaleString() || 'N/A'}\n\n` +
        `WARNING: This will automatically:\n` +
        `• Reject all other applications for this property\n` +
        `• Mark property as "acquired"\n` +
        `• Create active mortgage record\n\n` +
        `Do you want to proceed?`
      );
      if (!confirmed) return;
      
      try {
        await api.approveApplication(applicationId);
        showToast(`Application #${applicationId} approved! Mortgage created and property marked as acquired.`, 'success', 5000);
      } catch (error) {
        console.error('Failed to approve application:', error);
        showToast('Failed to approve application: ' + error.message, 'error');
      }
    } else {
      try {
        await api.updateApplicationStatus(applicationId, status);
        showToast(`Application status updated to ${status}`, 'success');
      } catch (error) {
        console.error('Failed to update status:', error);
        showToast('Failed to update application status: ' + error.message, 'error');
      }
    }
    
    loadApplications();
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status?.toLowerCase() === statusFilter;
  });

  return (
    <div id="lenderApplications" className="section">
      <div className="section-header">
        <h2>Mortgage Applications</h2>
        <div className="filter-controls">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      <div id="lenderAppsList">
        {loading ? (
          <p>Loading applications...</p>
        ) : filteredApplications.length === 0 ? (
          <div>
            <p>{statusFilter === 'all' ? 'No applications received yet.' : `No ${statusFilter} applications found.`}</p>
            <p>Debug: Loaded {applications.length} applications, showing {filteredApplications.length}</p>
          </div>
        ) : (
          filteredApplications.map((app, index) => (
            <div key={index} className="app-card">
              <div className="app-header">
                <h3>Application #{app.id}</h3>
                <span className={`status ${app.status}`}>{app.status}</span>
              </div>
              
              <div className="applicant-details">
                <h4>Buyer Information</h4>
                <div className="buyer-info-grid">
                  <div className="info-section">
                    <h5>Applicant Details</h5>
                    <p><strong>Full Name:</strong> {app.applicant || 'N/A'}</p>
                    <p><strong>Email:</strong> {app.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> {app.phone || 'N/A'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Financial Details</h5>
                    <p><strong>Loan Amount:</strong> KSH {app.amount?.toLocaleString() || 'N/A'}</p>
                    <p><strong>Monthly Income:</strong> {app.monthlyIncome || 'N/A'}</p>
                    <p><strong>Employment Status:</strong> {app.employmentStatus || 'N/A'}</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Property & Status</h5>
                    <p><strong>Property:</strong> {app.property || 'N/A'}</p>
                    <p><strong>Application Date:</strong> {app.submittedAt || 'N/A'}</p>
                    <p><strong>Status:</strong> <span className={`status ${app.status?.toLowerCase() || 'pending'}`}>
                      {app.status === 'approved' ? '✅ Approved' : 
                       app.status === 'rejected' ? '❌ Rejected' : 
                       app.status === 'auto_rejected' ? '🚫 Auto-Rejected (Another application approved)' :
                       '⏳ Pending'}
                    </span></p>
                    <p><strong>Notes:</strong> {app.notes || 'N/A'}</p>

                  </div>
                </div>
                
                {app.buyer?.documents && (
                  <div className="documents-section">
                    <h5>Submitted Documents</h5>
                    <div className="documents-list">
                      {app.buyer.documents.map((doc, idx) => (
                        <span key={idx} className="document-badge">{doc}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="app-actions">
                <button 
                  className="btn success" 
                  onClick={() => updateStatus(app.id, 'approved', app)}
                  disabled={app.status === 'approved' || app.status === 'rejected' || app.status === 'auto_rejected'}
                >
                  {app.status === 'approved' ? '✅ Approved' : 'Approve & Create Mortgage'}
                </button>
                <button 
                  className="btn danger" 
                  onClick={() => updateStatus(app.id, 'rejected', app)}
                  disabled={app.status === 'approved' || app.status === 'rejected' || app.status === 'auto_rejected'}
                >
                  {app.status === 'rejected' ? '❌ Rejected' : app.status === 'auto_rejected' ? '🚫 Auto-Rejected' : 'Reject'}
                </button>
                <button 
                  className="btn secondary" 
                  onClick={() => {
                    const message = prompt('What additional information do you need from the applicant?');
                    if (message) {
                      showToast(`Information request sent to ${app.applicantName || app.applicant}`, 'success');
                    }
                  }}
                >
                  Request More Info
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LenderApplications;