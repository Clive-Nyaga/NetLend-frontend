import { useState, useEffect } from 'react';

const NotificationModal = ({ isOpen, onClose, type = 'info', title, message, actions = [] }) => {
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

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          color: '#10b981',
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          borderColor: '#10b981'
        };
      case 'error':
        return {
          icon: '❌',
          color: '#ef4444',
          background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
          borderColor: '#ef4444'
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: '#f59e0b',
          background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
          borderColor: '#f59e0b'
        };
      case 'info':
      default:
        return {
          icon: 'ℹ️',
          color: '#3b82f6',
          background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
          borderColor: '#3b82f6'
        };
    }
  };

  if (!isOpen) return null;

  const typeStyles = getTypeStyles();

  return (
    <div className={`modal ${isVisible ? 'show' : ''}`}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div 
          className="modal-header" 
          style={{ 
            background: typeStyles.background,
            borderBottom: `3px solid ${typeStyles.borderColor}`,
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {typeStyles.icon}
          </div>
          <h3 style={{ 
            color: typeStyles.color, 
            margin: 0, 
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>
            {title}
          </h3>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            color: '#374151', 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            marginBottom: actions.length > 0 ? '2rem' : '0',
            whiteSpace: 'pre-line'
          }}>
            {message}
          </div>
          
          <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
            {actions.map((action, index) => (
              <button
                key={index}
                className={`btn ${action.type || 'btn-secondary'}`}
                onClick={() => {
                  if (action.onClick) action.onClick();
                  handleClose();
                }}
                style={{
                  minWidth: '100px',
                  padding: '0.75rem 1.5rem'
                }}
              >
                {action.label}
              </button>
            ))}
            
            {actions.length === 0 && (
              <button
                className="btn btn-primary"
                onClick={handleClose}
                style={{
                  minWidth: '100px',
                  padding: '0.75rem 1.5rem'
                }}
              >
                OK
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;