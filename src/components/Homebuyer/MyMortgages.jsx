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

  // Load payment history for all mortgages when they're loaded
  useEffect(() => {
    if (mortgages.length > 0) {
      mortgages.forEach(mortgage => {
        loadPaymentHistory(mortgage.id);
      });
    }
  }, [mortgages]);

  const loadMyMortgages = async () => {
    try {
      const response = await api.getBuyerMortgages();
      console.log('My Mortgages API Response:', response);
      if (response && response.length > 0) {
        console.log('First mortgage fields:', Object.keys(response[0]));
        console.log('Sample mortgage data:', JSON.stringify(response[0], null, 2));
        
        // Log payment-related fields specifically
        response.forEach((mortgage, index) => {
          console.log(`Mortgage ${index + 1} payment info:`, {
            id: mortgage.id,
            paymentsMade: mortgage.paymentsMade,
            remainingPayments: mortgage.remainingPayments,
            remainingBalance: mortgage.remainingBalance,
            status: mortgage.status,
            downPaymentMade: mortgage.downPaymentMade || 'field missing'
          });
        });
      }
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
    if (mortgage.paymentsMade && mortgage.totalTerm) {
      return Math.round((mortgage.paymentsMade / mortgage.totalTerm) * 100);
    }
    if (mortgage.principalAmount && mortgage.remainingBalance) {
      return Math.round(((mortgage.principalAmount - mortgage.remainingBalance) / mortgage.principalAmount) * 100);
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

  /**
   * Handle payment initiation
   * 
   * Determines payment type and prepares mortgage data:
   * - Down payment: If mortgage is approved but down payment not made
   * - Monthly payment: Regular scheduled payments for active mortgages
   */
  const handleMakePayment = (mortgage) => {
    // Check if down payment is required first
    const isDownPaymentNeeded = mortgage.status === 'approved' && !mortgage.downPaymentMade;
    
    if (isDownPaymentNeeded) {
      // Force down payment first
      setSelectedMortgage({
        ...mortgage,
        monthlyPayment: mortgage.monthlyPayment || calculateMonthlyPayment(mortgage.principalAmount, mortgage.interestRate, 25),
        downPaymentAmount: mortgage.downPaymentAmount || (mortgage.principalAmount * 0.2),
        paymentType: 'down'
      });
    } else if (mortgage.status === 'active') {
      // Allow monthly payments for active mortgages (down payment assumed made)
      setSelectedMortgage({
        ...mortgage,
        paymentType: 'monthly'
      });
    } else {
      // Should not reach here, but handle gracefully
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    setShowPaymentModal(false);
    
    // Refresh data immediately since backend updates in real-time
    await loadMyMortgages();
    if (selectedMortgage) {
      await loadPaymentHistory(selectedMortgage.id);
    }
  };

  const handleViewStatement = (mortgage) => {
    setNotification({
      isOpen: true,
      type: 'info',
      title: 'Mortgage Statement',
      message: `Statement for ${mortgage.property || `Mortgage #${mortgage.id}`}:\n\nPrincipal: KSH ${(mortgage.principalAmount || 0).toLocaleString()}\nRemaining: KSH ${(mortgage.remainingBalance || 0).toLocaleString()}\nPayments Made: ${mortgage.paymentsMade || 0}\nNext Payment: ${mortgage.nextPaymentDue ? new Date(mortgage.nextPaymentDue).toLocaleDateString() : 'N/A'}\n\nFull statement will be downloaded.`
    });
  };

  const handleViewPaymentHistory = async (mortgage) => {
    try {
      const history = await api.getPaymentHistory(mortgage.id);
      console.log('Payment history structure:', JSON.stringify(history.slice(0, 2), null, 2)); // Log first 2 payments
      setPaymentHistory(prev => ({ ...prev, [mortgage.id]: history }));
      
      const historyText = history.length > 0 
        ? history.map(payment => {
            const amount = payment.amountPaid || 0;
            const date = payment.date || 'N/A';
            const status = payment.status || 'completed';
            
            return `${date}: KSH ${amount.toLocaleString()} (${status})`;
          }).join('\n')
        : 'No payment history available yet.';
      
      setNotification({
        isOpen: true,
        type: 'info',
        title: 'Payment History',
        message: `Payment History for ${mortgage.property || `Mortgage #${mortgage.id}`}:\n\n${historyText}`
      });
    } catch (error) {
      console.error('Failed to load payment history:', error);
      setNotification({
        isOpen: true,
        type: 'info',
        title: 'Payment History',
        message: `Payment History for ${mortgage.property || `Mortgage #${mortgage.id}`}:\n\nNo payment history available yet.\n\nPayments will appear here after processing.`
      });
    }
  };

  const loadPaymentHistory = async (mortgageId) => {
    try {
      const history = await api.getPaymentHistory(mortgageId);
      console.log(`Payment history for mortgage ${mortgageId}:`, history);
      setPaymentHistory(prev => ({ ...prev, [mortgageId]: history }));
    } catch (error) {
      console.error(`Failed to load payment history for mortgage ${mortgageId}:`, error);
      // Set empty array as fallback
      setPaymentHistory(prev => ({ ...prev, [mortgageId]: [] }));
    }
  };

  return (
    <div className="section">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2>My Mortgages</h2>
        <button 
          className="btn btn-secondary" 
          onClick={loadMyMortgages}
          disabled={loading}
          style={{padding: '8px 16px'}}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>
      
      <div className="mortgages-summary">
        <div className="summary-stats">
          <div className="stat-item">
            <h4>Total Mortgages</h4>
            <span>{mortgages.length}</span>
          </div>
          <div className="stat-item">
            <h4>Total Outstanding</h4>
            <span>KSH {mortgages.reduce((sum, m) => sum + (m.remainingBalance || 0), 0).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <h4>Monthly Payments</h4>
            <span>KSH {mortgages.reduce((sum, m) => sum + (m.monthlyPayment || 0), 0).toLocaleString()}</span>
          </div>
          <div className="stat-item">
            <h4>Total Payments Made</h4>
            <span>{mortgages.reduce((sum, m) => sum + (paymentHistory[m.id]?.length || 0), 0)}</span>
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
                <h3>{mortgage.property || `Mortgage #${mortgage.id}`}</h3>
                <span className="status" style={{color: getStatusColor(mortgage.status)}}>
                  {mortgage.status === 'approved' && !mortgage.downPaymentMade 
                    ? 'Awaiting Down Payment' 
                    : (mortgage.status || 'active').charAt(0).toUpperCase() + (mortgage.status || 'active').slice(1)}
                </span>
              </div>
              
              <div className="mortgage-details">
                <div className="detail-section">
                  <h5>Loan Information</h5>
                  <p><strong>Lender:</strong> {mortgage.lender || 'N/A'}</p>
                  <p><strong>Principal Amount:</strong> KSH {(mortgage.principalAmount || 0).toLocaleString()}</p>
                  <p><strong>Remaining Balance:</strong> KSH {(mortgage.remainingBalance || 0).toLocaleString()}</p>
                  <p><strong>Interest Rate:</strong> {mortgage.interestRate || 0}% per annum</p>
                </div>
                
                <div className="detail-section">
                  <h5>Payment Details</h5>
                  {mortgage.status === 'approved' && !mortgage.downPaymentMade ? (
                    <>
                      <p><strong>Down Payment Required:</strong> KSH {((mortgage.downPaymentAmount || mortgage.principalAmount * 0.2) || 0).toLocaleString()}</p>
                      <p><strong>Monthly Payment (After Down):</strong> KSH {(mortgage.monthlyPayment || 0).toLocaleString()}</p>
                      <p><strong>Payment Schedule:</strong> Last day of each month</p>
                      <p style={{color: '#f59e0b', fontWeight: 'bold'}}>⚠️ Make down payment to activate mortgage</p>
                    </>
                  ) : (
                    <>
                      <p><strong>Monthly Payment:</strong> KSH {(mortgage.monthlyPayment || 0).toLocaleString()}</p>
                      <p><strong>Next Payment Due:</strong> {mortgage.nextPaymentDue ? new Date(mortgage.nextPaymentDue).toLocaleDateString() : 'Last day of current month'}</p>
                      <p><strong>Start Date:</strong> {mortgage.startDate ? new Date(mortgage.startDate).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>Payments Made:</strong> {mortgage.paymentsMade || 0} of {mortgage.totalTerm || 240}</p>
                      <p><strong>Payment History:</strong> {paymentHistory[mortgage.id] ? paymentHistory[mortgage.id].length : 0} recorded payments</p>
                    </>
                  )}
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
                  <p><strong>Remaining Payments:</strong> {mortgage.remainingPayments || (mortgage.totalTerm ? mortgage.totalTerm - (mortgage.paymentsMade || 0) : 'N/A')}</p>
                  {paymentHistory[mortgage.id] && paymentHistory[mortgage.id].length > 0 && (
                    <p><strong>Last Payment:</strong> {new Date(paymentHistory[mortgage.id][paymentHistory[mortgage.id].length - 1].date).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
              
              <div className="mortgage-actions">
                {mortgage.status === 'approved' && !mortgage.downPaymentMade ? (
                  <>
                    <button className="btn btn-primary" onClick={() => handleMakePayment(mortgage)} style={{backgroundColor: '#f59e0b', borderColor: '#f59e0b'}}>
                      Pay Down Payment - KSH {((mortgage.downPaymentAmount || mortgage.principalAmount * 0.2) || 0).toLocaleString()}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setNotification({isOpen: true, type: 'info', title: 'Down Payment Info', message: `Down Payment Required:\n\nAmount: KSH ${((mortgage.downPaymentAmount || mortgage.principalAmount * 0.2) || 0).toLocaleString()}\n\nAfter payment:\n• Mortgage becomes active\n• Monthly payments of KSH ${(mortgage.monthlyPayment || 0).toLocaleString()} due last day of each month\n• Loan term: ${mortgage.loanTermYears || 25} years`})}>Payment Info</button>
                  </>
                ) : mortgage.status === 'active' ? (
                  <>
                    <button className="btn btn-primary" onClick={() => handleMakePayment(mortgage)}>Make Monthly Payment</button>
                    <button className="btn btn-secondary" onClick={() => handleViewStatement(mortgage)}>View Statement</button>
                    <button className="btn btn-secondary" onClick={() => handleViewPaymentHistory(mortgage)}>
                      Payment History ({paymentHistory[mortgage.id]?.length || 0})
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-secondary" disabled style={{opacity: 0.5}}>Payment Not Available</button>
                    <button className="btn btn-secondary" onClick={() => handleViewStatement(mortgage)}>View Statement</button>
                  </>
                )}
                <button className="btn btn-secondary" onClick={() => setNotification({isOpen: true, type: 'info', title: 'Contact Lender', message: `Contact ${mortgage.lender || 'Lender'}:\n\nFor mortgage #${mortgage.id}\n\nThis will open a direct communication channel with your lender.`})}>Contact Lender</button>
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