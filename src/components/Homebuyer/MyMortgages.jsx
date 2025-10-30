import { useState, useEffect } from 'react';
import api from '../../services/api';
import PaymentModal from '../Modals/PaymentModal';
import NotificationModal from '../Modals/NotificationModal';

const MyMortgages = ({ user }) => {
  const [mortgages, setMortgages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedMortgage, setSelectedMortgage] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState({});
  const [notification, setNotification] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    loadMyMortgages();
  }, []);

  const loadMyMortgages = async () => {
    try {
      console.log('Loading buyer mortgages...');
      const response = await api.getBuyerMortgages();
      console.log('Mortgages response:', response);
      const mortgageData = Array.isArray(response) ? response : response.mortgages || [];
      setMortgages(mortgageData);
    } catch (error) {
      console.error('Failed to load mortgages:', error);
      setMortgages([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (mortgage) => {
    if (mortgage.payments_made && mortgage.total_payments) {
      return Math.round((mortgage.payments_made / mortgage.total_payments) * 100);
    }
    if (mortgage.principal_amount && mortgage.remaining_balance) {
      return Math.round(((mortgage.principal_amount - mortgage.remaining_balance) / mortgage.principal_amount) * 100);
    }
    return 0;
  };

  const calculateMonthlyPayment = (principal, rate, years) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'overdue': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#f59e0b';
    }
  };

  const handleMakePayment = (mortgage) => {
    setSelectedMortgage({
      ...mortgage,
      monthly_payment: mortgage.monthly_payment || calculateMonthlyPayment(mortgage.principal_amount, mortgage.interest_rate, 25)
    });
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    // Refresh mortgages data
    await loadMyMortgages();
    // Update payment history
    if (selectedMortgage) {
      loadPaymentHistory(selectedMortgage.id);
    }
  };

  const handleViewStatement = (mortgage) => {
    setNotification({
      isOpen: true,
      type: 'info',
      title: 'Mortgage Statement',
      message: `Statement for ${mortgage.property_details || `Mortgage #${mortgage.id}`}:\n\nPrincipal: KSH ${(mortgage.principal_amount || 0).toLocaleString()}\nRemaining: KSH ${(mortgage.remaining_balance || 0).toLocaleString()}\nPayments Made: ${mortgage.payments_made || 0}\nNext Payment: ${mortgage.next_payment_date ? new Date(mortgage.next_payment_date).toLocaleDateString() : 'N/A'}\n\nFull statement will be downloaded.`
    });
  };

  const handleViewPaymentHistory = async (mortgage) => {
    try {
      const history = await api.getPaymentHistory(mortgage.id);
      setPaymentHistory(prev => ({ ...prev, [mortgage.id]: history }));
      
      const historyText = history.map(payment => 
        `${payment.date}: KSH ${payment.amount.toLocaleString()} via ${payment.method} (${payment.status})`
      ).join('\n');
      
      setNotification({
        isOpen: true,
        type: 'info',
        title: 'Payment History',
        message: `Payment History for ${mortgage.property_details || `Mortgage #${mortgage.id}`}:\n\n${historyText || 'No payment history available'}`
      });
    } catch (error) {
      console.error('Failed to load payment history:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error',
        message: 'Failed to load payment history. Please try again.'
      });
    }
  };

  const loadPaymentHistory = async (mortgageId) => {
    try {
      const history = await api.getPaymentHistory(mortgageId);
      setPaymentHistory(prev => ({ ...prev, [mortgageId]: history }));
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  return (
    <div className="section">
      <h2>My Mortgages</h2>
      
      <div className="mortgages-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <h4>Total Mortgages</h4>
            <span>{mortgages.length}</span>
          </div>
          <div className="stat-item">
            <h4>Total Outstanding</h4>
            <span>KSH {mortgages.reduce((sum, m) => sum + (m.remaining_balance || 0), 0).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <h4>Monthly Payments</h4>
            <span>KSH {mortgages.reduce((sum, m) => sum + (m.monthly_payment || calculateMonthlyPayment(m.principal_amount, m.interest_rate, 25)), 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading your mortgages...</p>
      ) : mortgages.length === 0 ? (
        <div className="no-mortgages">
          <h3>No Active Mortgages</h3>
          <p>You don't have any active mortgages yet. Browse available properties to get started.</p>
        </div>
      ) : (
        <div className="mortgages-list">
          {mortgages.map(mortgage => (
            <div key={mortgage.id} className="mortgage-card">
              <div className="mortgage-header">
                <h3>{mortgage.property_details || `Mortgage #${mortgage.id}`}</h3>
                <span className="status" style={{color: getStatusColor(mortgage.status)}}>
                  {(mortgage.status || 'active').charAt(0).toUpperCase() + (mortgage.status || 'active').slice(1)}
                </span>
              </div>
              
              <div className="mortgage-details">
                <div className="detail-section">
                  <h5>Loan Information</h5>
                  <p><strong>Lender:</strong> {mortgage.lender_name || 'N/A'}</p>
                  <p><strong>Principal Amount:</strong> KSH {(mortgage.principal_amount || 0).toLocaleString()}</p>
                  <p><strong>Remaining Balance:</strong> KSH {(mortgage.remaining_balance || 0).toLocaleString()}</p>
                  <p><strong>Interest Rate:</strong> {mortgage.interest_rate || 0}% per annum</p>
                </div>
                
                <div className="detail-section">
                  <h5>Payment Details</h5>
                  <p><strong>Monthly Payment:</strong> KSH {(mortgage.monthly_payment || calculateMonthlyPayment(mortgage.principal_amount, mortgage.interest_rate, 25)).toLocaleString()}</p>
                  <p><strong>Next Payment:</strong> {mortgage.next_payment_date ? new Date(mortgage.next_payment_date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Start Date:</strong> {mortgage.start_date ? new Date(mortgage.start_date).toLocaleDateString() : 'N/A'}</p>
                  <p><strong>Payments Made:</strong> {mortgage.payments_made || 0} of {mortgage.total_payments || 'N/A'}</p>
                </div>
                
                <div className="detail-section">
                  <h5>Repayment Progress</h5>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${calculateProgress(mortgage)}%`}}
                    ></div>
                  </div>
                  <p>{calculateProgress(mortgage)}% Complete</p>
                  <p><strong>Remaining Payments:</strong> {mortgage.total_payments ? (mortgage.total_payments - (mortgage.payments_made || 0)) : 'N/A'}</p>
                </div>
              </div>
              
              <div className="mortgage-actions">
                <button className="btn btn-primary" onClick={() => handleMakePayment(mortgage)}>Make Payment</button>
                <button className="btn btn-secondary" onClick={() => handleViewStatement(mortgage)}>View Statement</button>
                <button className="btn btn-secondary" onClick={() => handleViewPaymentHistory(mortgage)}>Payment History</button>
                <button className="btn btn-secondary" onClick={() => setNotification({isOpen: true, type: 'info', title: 'Contact Lender', message: `Contact ${mortgage.lender_name || 'Lender'}:\n\nFor mortgage #${mortgage.id}\n\nThis will open a direct communication channel with your lender.`})}>Contact Lender</button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        mortgage={selectedMortgage}
        onPaymentSuccess={handlePaymentSuccess}
      />
      
      <NotificationModal
        isOpen={notification.isOpen}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </div>
  );
};

export default MyMortgages;