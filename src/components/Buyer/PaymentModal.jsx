import { useState } from 'react';
import MpesaPayment from './MpesaPayment';

const PaymentModal = ({ isOpen, onClose, property, loanDetails }) => {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [paymentStep, setPaymentStep] = useState('method'); // method, payment, success

  const handlePaymentSuccess = (paymentData) => {
    setPaymentStep('success');
    setTimeout(() => {
      onClose();
      alert('Application submitted successfully!');
    }, 2000);
  };

  const calculateAmount = () => {
    return loanDetails?.processingFee || 5000; // Default processing fee
  };

  if (!isOpen) return null;

  return (
    <div className="modal show">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        
        {paymentStep === 'method' && (
          <div>
            <h2>Payment Required</h2>
            <div className="payment-info">
              <p>Property: <strong>{property?.title}</strong></p>
              <p>Processing Fee: <strong>KSh {calculateAmount().toLocaleString()}</strong></p>
            </div>
            
            <div className="payment-methods">
              <h3>Select Payment Method:</h3>
              <div className="method-option">
                <input
                  type="radio"
                  id="mpesa"
                  name="paymentMethod"
                  value="mpesa"
                  checked={paymentMethod === 'mpesa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="mpesa">M-Pesa</label>
              </div>
            </div>
            
            <button 
              onClick={() => setPaymentStep('payment')}
              className="btn-primary"
            >
              Continue to Payment
            </button>
          </div>
        )}
        
        {paymentStep === 'payment' && (
          <MpesaPayment
            amount={calculateAmount()}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={() => setPaymentStep('method')}
          />
        )}
        
        {paymentStep === 'success' && (
          <div className="payment-success">
            <h2>Payment Successful!</h2>
            <p>Your loan application has been submitted.</p>
            <p>You will receive updates via SMS and email.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;