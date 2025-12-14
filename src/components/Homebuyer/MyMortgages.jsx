/**
 * MyMortgages Component - Homebuyer Mortgage Management Dashboard
 * 
 * This component displays and manages all mortgages for a logged-in homebuyer.
 * It handles the complete mortgage lifecycle from approval to completion.
 * 
 * KEY FEATURES:
 * 1. Mortgage Overview: Shows all active mortgages with key details
 * 2. Payment Processing: Handles down payments and monthly payments
 * 3. Payment History: Tracks all payments made on each mortgage
 * 4. Progress Tracking: Shows repayment progress and remaining balance
 * 5. Statement Generation: Provides mortgage statements and history
 * 
 * MORTGAGE STATES:
 * - 'approved': Mortgage approved but down payment not made
 * - 'active': Down payment made, monthly payments in progress
 * - 'completed': All payments made, mortgage fully paid
 * - 'overdue': Payments are past due
 * 
 * PAYMENT WORKFLOW:
 * 1. Approved mortgages require down payment first (typically 20%)
 * 2. After down payment, monthly payments become available
 * 3. Monthly payments are due on the last day of each month
 * 4. System tracks payment history and updates balances in real-time
 * 
 * INTEGRATION:
 * - Uses PaymentModal for processing payments
 * - Connects to backend API for mortgage and payment data
 * - Real-time updates after successful payments
 * - Toast notifications for user feedback
 */
import { useState, useEffect } from 'react';
import api from '../../services/api';
import PaymentModal from '../Modals/PaymentModal';
import NotificationModal from '../Modals/NotificationModal';

/**
 * MyMortgages Component
 * @param {Object} user - Current logged-in user object
 */
const MyMortgages = ({ user }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [mortgages, setMortgages] = useState([]);              // Array of user's mortgages
  const [loading, setLoading] = useState(true);                // Loading state for API calls
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Payment modal visibility
  const [selectedMortgage, setSelectedMortgage] = useState(null);   // Currently selected mortgage for payment
  const [paymentHistory, setPaymentHistory] = useState({});    // Payment history by mortgage ID
  const [notification, setNotification] = useState({ isOpen: false, type: 'info', title: '', message: '' }); // Notification modal state

  // ============================================================================
  // LIFECYCLE HOOKS
  // ============================================================================
  
  // Load mortgages when component mounts
  useEffect(() => {
    loadMyMortgages();
  }, []);

  // Load payment history for all mortgages when mortgage data is available
  useEffect(() => {
    if (mortgages.length > 0) {
      // Fetch payment history for each mortgage to show payment counts and progress
      mortgages.forEach(mortgage => {
        loadPaymentHistory(mortgage.id);
      });
    }
  }, [mortgages]);

  // ============================================================================
  // DATA LOADING FUNCTIONS
  // ============================================================================
  
  /**
   * Load all mortgages for the current user
   * Fetches mortgage data from backend and updates component state
   * Includes debugging logs to track API responses and data structure
   */
  const loadMyMortgages = async () => {
    try {
      const response = await api.getBuyerMortgages();
      console.log('My Mortgages API Response:', response);
      console.log('Response type:', typeof response, 'Is array:', Array.isArray(response));
      
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
      } else {
        console.log('No mortgages found or empty response');
      }
      
      const mortgageData = Array.isArray(response) ? response : response.mortgages || [];
      console.log('Final mortgage data:', mortgageData);
      setMortgages(mortgageData);
    } catch (error) {
      console.error('Failed to load mortgages:', error);
      setMortgages([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // CALCULATION FUNCTIONS
  // ============================================================================
  
  /**
   * Calculate repayment progress percentage
   * Uses either payment count or balance reduction to determine progress
   * @param {Object} mortgage - Mortgage object with payment data
   * @returns {number} Progress percentage (0-100)
   */
  const calculateProgress = (mortgage) => {
    if (mortgage.paymentsMade && mortgage.totalTerm) {
      return Math.round((mortgage.paymentsMade / mortgage.totalTerm) * 100);
    }
    if (mortgage.principalAmount && mortgage.remainingBalance) {
      return Math.round(((mortgage.principalAmount - mortgage.remainingBalance) / mortgage.principalAmount) * 100);
    }
    return 0;
  };

  /**
   * Calculate monthly payment using standard amortization formula
   * Used as fallback when backend doesn't provide monthly payment amount
   * @param {number} principal - Loan principal amount
   * @param {number} rate - Annual interest rate (percentage)
   * @param {number} years - Loan term in years
   * @returns {number} Monthly payment amount
   */
  const calculateMonthlyPayment = (principal, rate, years) => {
    const monthlyRate = rate / 100 / 12;
    const numPayments = years * 12;
    return Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1));
  };



  /**
   * Get color code for mortgage status display
   * @param {string} status - Mortgage status
   * @returns {string} CSS color code
   */
  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'overdue': return '#ef4444';
      case 'completed': return '#6b7280';
      default: return '#f59e0b';
    }
  };

  // ============================================================================
  // PAYMENT HANDLING FUNCTIONS
  // ============================================================================
  
  /**
   * Handle payment initiation
   * 
   * Determines the appropriate payment type based on mortgage state:
   * - Down payment: Required first payment to activate mortgage
   * - Monthly payment: Regular scheduled payments for active mortgages
   * 
   * Uses backend-provided downPaymentMade field for accurate detection
   * @param {Object} mortgage - Mortgage object to process payment for
   */
  const handleMakePayment = (mortgage) => {
    // Use backend-provided downPaymentMade field
    const isDownPaymentNeeded = !mortgage.downPaymentMade;
    
    setSelectedMortgage({
      ...mortgage,
      monthlyPayment: mortgage.monthlyPayment || calculateMonthlyPayment(mortgage.principalAmount, mortgage.interestRate, 25),
      paymentType: isDownPaymentNeeded ? 'down' : 'monthly'
    });
    
    setShowPaymentModal(true);
  };

  /**
   * Handle successful payment processing
   * Refreshes mortgage data and payment history after successful payment
   * @param {Object} paymentResult - Result object from payment processing
   */
  const handlePaymentSuccess = async (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    setShowPaymentModal(false);
    
    // Refresh data immediately since backend updates in real-time
    await loadMyMortgages();
    if (selectedMortgage) {
      await loadPaymentHistory(selectedMortgage.id);
    }
  };

  // ============================================================================
  // UI INTERACTION FUNCTIONS
  // ============================================================================
  
  /**
   * Display mortgage statement in notification modal
   * Shows key mortgage information and payment details
   * @param {Object} mortgage - Mortgage object to display statement for
   */
  const handleViewStatement = (mortgage) => {
    setNotification({
      isOpen: true,
      type: 'info',
      title: 'Mortgage Statement',
      message: `Statement for ${mortgage.property || `Mortgage #${mortgage.id}`}:\n\nPrincipal: KSH ${(mortgage.principalAmount || 0).toLocaleString()}\nRemaining: KSH ${(mortgage.remainingBalance || 0).toLocaleString()}\nPayments Made: ${mortgage.paymentsMade || 0}\nNext Payment: ${mortgage.nextPaymentDue ? new Date(mortgage.nextPaymentDue).toLocaleDateString() : 'N/A'}\n\nFull statement will be downloaded.`
    });
  };

  /**
   * Display payment history for a specific mortgage
   * Fetches and formats payment history data for user display
   * @param {Object} mortgage - Mortgage object to show history for
   */
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

  /**
   * Load payment history for a specific mortgage
   * Updates component state with payment history data
   * @param {number} mortgageId - ID of mortgage to load history for
   */
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
                {!mortgage.downPaymentMade ? (
                  <>
                    <button className="btn btn-primary" onClick={() => handleMakePayment(mortgage)} style={{backgroundColor: '#f59e0b', borderColor: '#f59e0b'}}>
                      Pay Down Payment - KSH {((mortgage.downPaymentAmount || mortgage.principalAmount * 0.2) || 0).toLocaleString()}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setNotification({isOpen: true, type: 'info', title: 'Down Payment Info', message: `Down Payment Required:\n\nAmount: KSH ${((mortgage.downPaymentAmount || mortgage.principalAmount * 0.2) || 0).toLocaleString()}\n\nAfter payment:\n• Mortgage becomes active\n• Monthly payments of KSH ${(mortgage.monthlyPayment || 0).toLocaleString()} due last day of each month\n• Loan term: ${mortgage.loanTermYears || 25} years`})}>Payment Info</button>
                  </>
                ) : mortgage.downPaymentMade ? (
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