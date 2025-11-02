/**
 * PaymentModal Component
 * 
 * Handles mortgage payments including:
 * - Down payments (first payment when mortgage is approved)
 * - Monthly mortgage payments (scheduled payments)
 * - Payment method selection and processing
 * - Payment validation and scheduling
 */
import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const PaymentModal = ({ isOpen, onClose, mortgage, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    paymentType: 'monthly', // 'down' or 'monthly'
    paymentMethod: 'mpesa',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { showToast } = useToast();

  /**
   * Initialize payment data when mortgage changes
   * Determines if this is a down payment or monthly payment
   */
  useEffect(() => {
    if (mortgage) {
      const isDownPayment = !mortgage.downPaymentMade && mortgage.status === 'approved';
      const paymentType = isDownPayment ? 'down' : 'monthly';
      const amount = isDownPayment ? mortgage.downPaymentAmount || (mortgage.principalAmount * 0.2) : mortgage.monthlyPayment || 0;
      
      setPaymentData(prev => ({
        ...prev,
        amount: amount,
        paymentType: paymentType
      }));
    }
  }, [mortgage]);

  /**
   * Process mortgage payment
   * 
   * Workflow:
   * 1. Validate payment amount and method
   * 2. Process payment through selected method
   * 3. Update mortgage status and payment schedule
   * 4. Handle down payment vs monthly payment logic
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate payment amount
      if (paymentData.paymentType === 'down' && paymentData.amount < (mortgage.downPaymentAmount || mortgage.principalAmount * 0.2)) {
        throw new Error('Down payment amount is insufficient');
      }

      // Process payment through API
      const paymentResult = await api.processMortgagePayment({
        mortgageId: mortgage.id,
        amount: paymentData.amount,
        paymentType: paymentData.paymentType,
        paymentMethod: paymentData.paymentMethod,
        phoneNumber: paymentData.phoneNumber,
        cardNumber: paymentData.cardNumber,
        expiryDate: paymentData.expiryDate,
        cvv: paymentData.cvv,
        accountNumber: paymentData.accountNumber
      });

      // Show success message based on payment type
      const successMessage = paymentData.paymentType === 'down' 
        ? 'Down payment processed successfully! Your mortgage is now active.'
        : 'Monthly payment processed successfully! Next payment due on the last day of next month.';
      
      setSuccess(successMessage);
      showToast(successMessage, 'success', 5000);
      
      // Update parent component and close modal
      setTimeout(() => {
        onPaymentSuccess(paymentResult);
        onClose();
      }, 2000);
    } catch (error) {
      const errorMessage = error.message || 'Payment failed. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen || !mortgage) return null;

  return (
    <div className="modal show">
      <div className="modal-content" style={{maxWidth: '500px'}}>
        <div className="modal-header">
          <h3>Make Payment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
        
        {/* Payment Summary Section */}
        <div className="application-summary">
          <h5>Payment Details</h5>
          <p><strong>Property:</strong> {mortgage.property || `Mortgage #${mortgage.id}`}</p>
          
          {paymentData.paymentType === 'down' ? (
            <>
              <p><strong>Payment Type:</strong> Down Payment (Initial Payment)</p>
              <p><strong>Required Amount:</strong> KSH {(mortgage.downPaymentAmount || mortgage.principalAmount * 0.2)?.toLocaleString()}</p>
              <p><strong>Note:</strong> This activates your mortgage and starts monthly payments</p>
            </>
          ) : (
            <>
              <p><strong>Payment Type:</strong> Monthly Mortgage Payment</p>
              <p><strong>Monthly Amount:</strong> KSH {mortgage.monthlyPayment?.toLocaleString()}</p>
              <p><strong>Due Date:</strong> Last day of every month</p>
              <p><strong>Next Due:</strong> {mortgage.nextPaymentDue ? new Date(mortgage.nextPaymentDue).toLocaleDateString() : 'End of current month'}</p>
            </>
          )}
          
          <p><strong>Remaining Balance:</strong> KSH {(mortgage.remainingBalance || mortgage.principalAmount)?.toLocaleString()}</p>
        </div>

        {error && (
          <div className="profile-warning" style={{background: 'linear-gradient(135deg, #fee2e2, #fecaca)', borderColor: '#ef4444'}}>
            <p style={{color: '#991b1b'}}>{error}</p>
          </div>
        )}

        {success && (
          <div className="profile-warning" style={{background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', borderColor: '#10b981'}}>
            <p style={{color: '#065f46'}}>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Payment Amount Section */}
          <div className="form-group">
            <label>Payment Amount (KSH)</label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleChange}
              min={paymentData.paymentType === 'down' ? (mortgage.downPaymentAmount || mortgage.principalAmount * 0.2) : mortgage.monthlyPayment}
              max={paymentData.paymentType === 'monthly' ? mortgage.remainingBalance : undefined}
              required
            />
            {paymentData.paymentType === 'down' && (
              <small style={{color: '#666', fontSize: '0.875rem'}}>
                Minimum down payment: KSH {(mortgage.downPaymentAmount || mortgage.principalAmount * 0.2)?.toLocaleString()}
              </small>
            )}
            {paymentData.paymentType === 'monthly' && (
              <small style={{color: '#666', fontSize: '0.875rem'}}>
                Standard monthly payment: KSH {mortgage.monthlyPayment?.toLocaleString()}
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
              required
            >
              <option value="mpesa">M-Pesa</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {paymentData.paymentMethod === 'mpesa' && (
            <div className="form-group">
              <label>M-Pesa Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={paymentData.phoneNumber}
                onChange={handleChange}
                placeholder="254712345678"
                required
              />
            </div>
          )}

          {paymentData.paymentMethod === 'card' && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {paymentData.paymentMethod === 'bank' && (
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                name="accountNumber"
                value={paymentData.accountNumber}
                onChange={handleChange}
                placeholder="Your bank account number"
                required
              />
            </div>
          )}

          {/* Payment Action Buttons */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing Payment...' : 
               paymentData.paymentType === 'down' ? 
               `Pay Down Payment - KSH ${paymentData.amount?.toLocaleString()}` :
               `Pay Monthly - KSH ${paymentData.amount?.toLocaleString()}`}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
          
          {/* Payment Schedule Information */}
          {paymentData.paymentType === 'down' && (
            <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
              <h6 style={{margin: '0 0 0.5rem 0', color: '#495057'}}>After Down Payment:</h6>
              <p style={{margin: '0', fontSize: '0.875rem', color: '#666'}}>
                • Monthly payments of KSH {mortgage.monthlyPayment?.toLocaleString()} will be due on the last day of each month<br/>
                • Total loan term: {mortgage.loanTermYears || 25} years<br/>
                • Next payment due: End of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          )}
        </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;