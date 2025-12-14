/**
 * Toast Notification System for NetLend Application
 * 
 * This context provides a global notification system that replaces browser alerts
 * with modern, user-friendly toast notifications. It's used throughout the app
 * to provide feedback for user actions like payments, form submissions, and errors.
 * 
 * FEATURES:
 * - Multiple toast types: success, error, warning, info
 * - Auto-dismiss with configurable duration
 * - Stacked display for multiple simultaneous notifications
 * - Global accessibility from any component
 * - Smooth animations and modern styling
 * 
 * USAGE EXAMPLES:
 * - Payment success: showToast('Payment processed successfully!', 'success')
 * - Form errors: showToast('Please fill all required fields', 'error')
 * - Loading states: showToast('Processing your request...', 'info')
 * - Warnings: showToast('This action cannot be undone', 'warning')
 * 
 * INTEGRATION:
 * - Wraps the entire app in App.jsx
 * - Used by PaymentModal, API calls, form submissions
 * - Replaces all alert() calls for better UX
 */
import { createContext, useContext, useState } from 'react';
import Toast from '../components/Toast';

// Create React Context for toast notifications
const ToastContext = createContext();

/**
 * Custom hook to access toast notification functionality
 * 
 * This hook provides access to the showToast function from any component
 * within the ToastProvider tree. It includes error checking to ensure
 * proper usage within the provider context.
 * 
 * @returns {Object} Toast context with showToast function
 * @throws {Error} If used outside of ToastProvider
 * 
 * USAGE:
 * const { showToast } = useToast();
 * showToast('Success message', 'success');
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * ToastProvider Component - Global Toast Notification Manager
 * 
 * This provider component manages the global state of toast notifications
 * and renders them in a fixed position on the screen. It handles:
 * - Toast creation with unique IDs
 * - Toast removal and cleanup
 * - Stacking multiple toasts vertically
 * - Providing context to child components
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to wrap
 */
export const ToastProvider = ({ children }) => {
  // Array of active toast notifications
  const [toasts, setToasts] = useState([]);

  /**
   * Display a new toast notification
   * 
   * Creates and displays a toast notification with the specified parameters.
   * Each toast gets a unique ID based on timestamp for tracking and removal.
   * 
   * @param {string} message - Text message to display
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Auto-dismiss duration in milliseconds (default: 3000)
   * 
   * TOAST TYPES:
   * - 'success': Green background, checkmark icon
   * - 'error': Red background, X icon
   * - 'warning': Orange background, warning icon
   * - 'info': Blue background, info icon
   */
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now(); // Unique ID based on timestamp
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]); // Add to toast array
  };

  /**
   * Remove a specific toast notification
   * 
   * Removes a toast from the active toasts array by filtering out
   * the toast with the matching ID. Called automatically when toasts
   * expire or when users manually dismiss them.
   * 
   * @param {number} id - Unique ID of the toast to remove
   */
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {/* Render all child components with toast context */}
      {children}
      
      {/* Fixed position container for toast notifications */}
      <div className="toast-container">
        {toasts.map((toast, index) => (
          // Each toast is positioned vertically based on its index
          <div key={toast.id} style={{ top: `${20 + index * 70}px` }}>
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};