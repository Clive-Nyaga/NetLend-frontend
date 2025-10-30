import { useState, useEffect } from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '🚨',
          color: '#ef4444',
          confirmButtonClass: 'btn danger'
        };
      case 'warning':
      default:
        return {
          icon: '⚠️',
          color: '#f59e0b',
          confirmButtonClass: 'btn warning'
        };
    }
  };

  if (!isOpen) return null;

  const typeStyles = getTypeStyles();

  return (
    <div className={`modal ${isVisible ? 'show' : ''}`}>
      <div className="modal-content" style={{ maxWidth: '450px' }}>
        <div className="modal-body" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {typeStyles.icon}
          </div>
          <h3 style={{ 
            color: typeStyles.color, 
            margin: '0 0 1rem 0', 
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {title}
          </h3>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            margin: '0 0 2rem 0',
            whiteSpace: 'pre-line'
          }}>
            {message}
          </p>
        </div>
        
        <div className="form-actions" style={{ justifyContent: 'center', padding: '0 2rem 2rem' }}>
          <button
            className="btn btn-secondary"
            onClick={handleClose}
            style={{
              minWidth: '120px',
              padding: '0.75rem 1.5rem'
            }}
          >
            {cancelText}
          </button>
          <button
            className={typeStyles.confirmButtonClass}
            onClick={handleConfirm}
            style={{
              minWidth: '120px',
              padding: '0.75rem 1.5rem'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;