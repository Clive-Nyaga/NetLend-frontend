import { useState } from 'react';

const MpesaPayment = ({ amount, onPaymentSuccess, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    
    // Simulate M-Pesa payment process
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const paymentData = {
        transactionId: `MP${Date.now()}`,
        amount: amount,
        phoneNumber: phoneNumber,
        status: 'completed',
        timestamp: new Date().toISOString()
      };
      
      onPaymentSuccess(paymentData);
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mpesa-payment">
      <h3>M-Pesa Payment</h3>
      <div className="payment-details">
        <p>Amount: <strong>KSh {amount?.toLocaleString()}</strong></p>
        
        <div className="form-group">
          <label>M-Pesa Phone Number:</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254712345678"
            maxLength="12"
          />
        </div>
        
        <div className="payment-buttons">
          <button 
            onClick={handlePayment} 
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
        
        {loading && (
          <div className="payment-status">
            <p>Please check your phone for M-Pesa prompt...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MpesaPayment;