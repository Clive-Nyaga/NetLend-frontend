import { useState, useEffect } from 'react';
import PaymentModal from './PaymentModal';

const MyApplications = ({ buyerId }) => {
  const [applications, setApplications] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    // Mock data for now since API endpoint doesn't exist
    setApplications([
      {
        id: 1,
        property_title: 'Modern 3BR Apartment',
        loan_amount: 6000000,
        status: 'pending',
        created_at: new Date().toISOString(),
        payment_required: true
      }
    ]);
  }, [buyerId]);

  const handlePayNow = (application) => {
    setSelectedApplication(application);
    setShowPaymentModal(true);
  };

  return (
    <div>
      <h3>My Loan Applications</h3>
      
      <div className="applications-list">
        {applications.map(application => (
          <div key={application.id} className="application-card">
            <h4>{application.property_title}</h4>
            <p>Loan Amount: KSh {application.loan_amount?.toLocaleString()}</p>
            <p>Status: <span className={`status ${application.status}`}>{application.status}</span></p>
            <p>Applied: {new Date(application.created_at).toLocaleDateString()}</p>
            <div className="application-actions">
              <button>View Details</button>
              {application.payment_required && (
                <button onClick={() => handlePayNow(application)} className="btn-primary">
                  Pay Processing Fee
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {applications.length === 0 && (
        <p>No applications found. Start by searching for properties!</p>
      )}
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        property={{ title: selectedApplication?.property_title }}
        loanDetails={{ processingFee: 5000 }}
      />
    </div>
  );
};

export default MyApplications;