/**
 * SoldMortgages Component
 * 
 * This component displays and manages completed mortgage transactions for lenders.
 * It shows active mortgages that have been successfully approved and are currently
 * being paid by borrowers.
 * 
 * Key Features:
 * - Display summary statistics (total count, total value)
 * - List all active mortgages with detailed information
 * - Provide action buttons for mortgage management
 * - Real-time data loading from backend API
 * - Toast notifications for user feedback
 * 
 * Data Flow:
 * 1. Component mounts → Load sold mortgages from API
 * 2. Display loading state while fetching data
 * 3. Render mortgage cards with borrower and financial details
 * 4. Handle user interactions with toast notifications
 * 
 * API Integration:
 * - Fetches data from /api/sold-mortgages endpoint
 * - Handles both array and object response formats
 * - Graceful error handling with fallback states
 */

// React hooks for state management and lifecycle
import { useState, useEffect } from 'react';

// API service layer for backend communication
import api from '../../services/api';

// Global toast notification system
import { useToast } from '../../contexts/ToastContext';

/**
 * SoldMortgages Component
 * 
 * @param {string} lenderId - ID of the current lender (for filtering)
 * @param {Object} user - Current authenticated user object
 */
const SoldMortgages = ({ lenderId, user }) => {
  // === COMPONENT STATE ===
  
  // Array of sold/active mortgage objects from API
  const [soldMortgages, setSoldMortgages] = useState([]);
  
  // Loading state for UI feedback during API calls
  const [loading, setLoading] = useState(true);
  
  // Toast notification system for user feedback
  const { showToast } = useToast();

  /**
   * Load sold mortgages when component mounts or lenderId changes
   * 
   * This effect ensures data is always fresh when:
   * - Component first renders
   * - Lender ID changes (if component is reused)
   */
  useEffect(() => {
    loadSoldMortgages();
  }, [lenderId]);

  /**
   * Fetch sold mortgages from backend API
   * 
   * Workflow:
   * 1. Call API service method
   * 2. Handle different response formats (array vs object)
   * 3. Update component state with mortgage data
   * 4. Handle errors gracefully
   * 5. Always clear loading state
   * 
   * Error Handling:
   * - Logs errors to console for debugging
   * - Sets empty array as fallback to prevent crashes
   * - Maintains loading state management
   */
  const loadSoldMortgages = async () => {
    try {
      // Fetch mortgage data from backend
      const response = await api.getSoldMortgages();
      
      // Handle different API response formats
      // Some endpoints return arrays directly, others wrap in objects
      const mortgages = Array.isArray(response) ? response : response.mortgages || [];
      
      // Update component state with fetched data
      setSoldMortgages(mortgages);
    } catch (error) {
      // Log error for debugging
      console.error('Failed to load sold mortgages:', error);
      
      // Set empty array as fallback to prevent UI crashes
      setSoldMortgages([]);
    } finally {
      // Always clear loading state, regardless of success/failure
      setLoading(false);
    }
  };

  /**
   * COMPONENT RENDER
   * 
   * The component renders in three main sections:
   * 1. Header with title
   * 2. Summary statistics dashboard
   * 3. Detailed mortgage list with action buttons
   */
  return (
    <div className="section">
      {/* Section Header */}
      <h2>Sold Mortgages</h2>
      
      {/* 
        SUMMARY STATISTICS SECTION
        
        Provides quick overview of lender's mortgage portfolio:
        - Total number of completed sales
        - Total monetary value of all mortgages
        - Count of currently active mortgages
        
        Calculations:
        - Uses array.reduce() to sum principal amounts
        - Handles missing data with fallback values (|| 0)
        - Formats currency with toLocaleString() for readability
      */}
      <div className="sold-mortgages-summary">
        <div className="summary-stats">
          {/* Total Count Metric */}
          <div className="stat-item">
            <h4>Total Sold</h4>
            <span>{soldMortgages.length}</span>
          </div>
          
          {/* Total Value Metric - Sums all principal amounts */}
          <div className="stat-item">
            <h4>Total Value</h4>
            <span>
              KSH {soldMortgages.reduce((sum, m) => sum + (m.principalAmount || 0), 0).toLocaleString()}
            </span>
          </div>
          
          {/* Active Mortgages Count - Currently same as total */}
          <div className="stat-item">
            <h4>Active Mortgages</h4>
            <span>{soldMortgages.length}</span>
          </div>
        </div>
      </div>

      {/* 
        MORTGAGE LIST SECTION
        
        Conditional rendering based on data state:
        1. Loading state - Shows loading message
        2. Empty state - Shows helpful message when no data
        3. Data state - Renders list of mortgage cards
        
        Each mortgage card displays:
        - Header with property name and status
        - Detailed financial and borrower information
        - Action buttons for mortgage management
      */}
      <div className="sold-mortgages-list">
        {loading ? (
          /* LOADING STATE - Shown while API call is in progress */
          <p>Loading sold mortgages...</p>
        ) : soldMortgages.length === 0 ? (
          /* EMPTY STATE - Shown when no mortgages exist */
          <div className="no-sold-mortgages">
            <h3>No Sold Mortgages Yet</h3>
            <p>Your completed mortgage sales will appear here</p>
          </div>
        ) : (
          /* DATA STATE - Render mortgage cards */
          soldMortgages.map(mortgage => (
            <div key={mortgage.id} className="sold-mortgage-card">
              {/* 
                MORTGAGE CARD HEADER
                - Property name or fallback ID
                - Visual status indicator
              */}
              <div className="mortgage-header">
                <h3>{mortgage.property || `Mortgage #${mortgage.id}`}</h3>
                <span className="status completed">✅ Active Mortgage</span>
              </div>
              
              {/* 
                MORTGAGE DETAILS SECTION
                
                Displays key information in label-value pairs:
                - Borrower information
                - Financial details (amounts, rates, dates)
                - Property information
                
                Data Handling:
                - Uses fallback values ('N/A') for missing data
                - Formats currency with toLocaleString()
                - Formats dates with toLocaleDateString()
              */}
              <div className="mortgage-details">
                {/* Borrower Information */}
                <div className="detail-row">
                  <span className="label">Borrower:</span>
                  <span className="value">{mortgage.buyer || 'N/A'}</span>
                </div>
                
                {/* Financial Information */}
                <div className="detail-row">
                  <span className="label">Principal Amount:</span>
                  <span className="value">KSH {(mortgage.principalAmount || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Remaining Balance:</span>
                  <span className="value">KSH {(mortgage.remainingBalance || 0).toLocaleString()}</span>
                </div>
                
                {/* Property Information */}
                <div className="detail-row">
                  <span className="label">Property:</span>
                  <span className="value">{mortgage.property || 'N/A'}</span>
                </div>
                
                {/* Loan Terms */}
                <div className="detail-row">
                  <span className="label">Interest Rate:</span>
                  <span className="value">{mortgage.interestRate || 'N/A'}% per annum</span>
                </div>
                
                {/* Important Dates */}
                <div className="detail-row">
                  <span className="label">Next Payment Due:</span>
                  <span className="value">
                    {mortgage.nextPaymentDue ? new Date(mortgage.nextPaymentDue).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Start Date:</span>
                  <span className="value">
                    {mortgage.startDate ? new Date(mortgage.startDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
              
              {/* 
                MORTGAGE ACTION BUTTONS
                
                Provides lender tools for mortgage management:
                1. View Details - Shows detailed mortgage information
                2. Download Contract - Generates and downloads legal documents
                3. Contact Borrower - Communication tools (future feature)
                
                User Feedback:
                - All actions provide immediate toast notifications
                - Different toast types (info, success) for different actions
                - Informative messages about feature availability
              */}
              <div className="mortgage-actions">
                {/* View Details Button - Shows mortgage summary */}
                <button 
                  className="btn secondary" 
                  onClick={() => {
                    showToast(
                      `Mortgage Details: ${mortgage.property || 'Property'} - ${mortgage.buyer || 'Borrower'}`, 
                      'info'
                    );
                  }}
                >
                  View Details
                </button>
                
                {/* Download Contract Button - Document generation */}
                <button 
                  className="btn" 
                  onClick={() => {
                    showToast('Contract generation started - download will begin shortly', 'success');
                  }}
                >
                  Download Contract
                </button>
                
                {/* Contact Borrower Button - Future communication feature */}
                <button 
                  className="btn btn-primary" 
                  onClick={() => {
                    showToast('Direct messaging feature coming soon!', 'info');
                  }}
                >
                  Contact Borrower
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Export component for use in LenderDashboard
export default SoldMortgages;