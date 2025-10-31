import { useState } from 'react';
import api from '../../services/api';

const PaymentModal = ({ isOpen, onClose, mortgage, onPaymentSuccess }) => {
  const [paymentData, setPaymentData] = useState({
    amount: mortgage?.monthly_payment || 0,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate payment processing
      const paymentResult = await api.processMortgagePayment({
        mortgageId: mortgage.id,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        ...paymentData
      });

      setSuccess('Payment processed successfully!');
      setTimeout(() => {
        onPaymentSuccess(paymentResult);
        onClose();
      }, 2000);
    } catch (error) {
      setError(error.message || 'Payment failed. Please try again.');
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
        
        <div className="application-summary">
          <h5>Payment Details</h5>
          <p><strong>Property:</strong> {mortgage.property_details || `Mortgage #${mortgage.id}`}</p>
          <p><strong>Monthly Payment:</strong> KSH {mortgage.monthly_payment?.toLocaleString()}</p>
          <p><strong>Due Date:</strong> {mortgage.next_payment_date ? new Date(mortgage.next_payment_date).toLocaleDateString() : 'N/A'}</p>
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
          <div className="form-group">
            <label>Payment Amount (KSH)</label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleChange}
              min="1"
              required
            />
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

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Processing Payment...' : `Pay KSH ${paymentData.amount?.toLocaleString()}`}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;