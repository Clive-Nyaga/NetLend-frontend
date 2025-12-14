/**
 * NetLend API Service Layer
 * 
 * NetLend is a digital mortgage platform for Kenya that connects homebuyers with lenders.
 * This service layer handles all communication with the Flask backend API.
 * 
 * ARCHITECTURE OVERVIEW:
 * - Frontend: React.js with Vite build tool
 * - Backend: Flask API with SQLAlchemy ORM
 * - Database: PostgreSQL for production, SQLite for development
 * - Authentication: JWT tokens with Bearer authentication
 * - Payment Processing: M-Pesa, Card, and Bank Transfer integration
 * 
 * USER ROLES:
 * 1. Homebuyers: Browse properties, apply for mortgages, make payments
 * 2. Lenders: List properties, review applications, approve/reject mortgages
 * 3. Admins: Manage users, oversee platform operations
 * 
 * MORTGAGE WORKFLOW:
 * 1. Lender creates mortgage listing with property details and terms
 * 2. Homebuyer submits application with financial information
 * 3. Lender reviews creditworthiness and approves/rejects application
 * 4. Approved mortgages require down payment (typically 20% of principal)
 * 5. After down payment, monthly payments due on last day of each month
 * 6. System tracks payment history, remaining balance, and loan progress
 * 
 * PAYMENT SYSTEM:
 * - Down payments activate the mortgage and start monthly payment schedule
 * - Monthly payments calculated using standard amortization formula
 * - Payments processed through M-Pesa, credit/debit cards, or bank transfers
 * - Real-time balance updates and payment history tracking
 */
const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Main API object containing all endpoint methods
 * All methods return Promises and handle authentication automatically
 * JWT tokens are retrieved from localStorage and included in Authorization headers
 */
const api = {
  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================
  // Handle user login, registration, and session management
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    const result = await response.json();
    if (!response.ok) {
      console.error('Login error:', result);
      throw new Error(result.message || 'Login failed');
    }
    return result;
  },

  // ============================================================================
  // PROPERTY ENDPOINTS
  // ============================================================================
  // Browse available mortgage properties for homebuyers
  getProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/homebuyer/properties`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  },

  // ============================================================================
  // LENDER ENDPOINTS
  // ============================================================================
  // Lender-specific operations: listings, applications, approvals
  getLenderProducts: async (lenderId) => {
    const response = await fetch(`${API_BASE_URL}/lender/${lenderId}/products`);
    return response.json();
  },

  createProduct: async (lenderId, productData) => {
    const response = await fetch(`${API_BASE_URL}/lender/${lenderId}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  getLenderApplications: async (lenderId) => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/lender/applications`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  },

  getLenderListings: async (lenderId) => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/lender/mortgages`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    return data;
  },

  createMortgageListing: async (listingData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/mortgages/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(listingData)
    });
    const result = await response.json();
    if (!response.ok) {
      console.error('Backend error details:', result);
      throw new Error(result.message || result.error || 'Failed to create listing');
    }
    return result;
  },

  approveApplication: async (applicationId) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/lender/applications/${applicationId}/approve`, {
      method: 'POST',
      headers
    });
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || result.error || 'Failed to approve application');
    }
    
    return response.json();
  },

  updateApplicationStatus: async (applicationId, status) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/lender/applications/${applicationId}/status`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || result.error || 'Failed to update status');
    }
    
    return response.json();
  },

  getSoldMortgages: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/lender/sold-mortgages`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  },

  register: async (userData) => {
    const requestData = {
      email: userData.email,
      password: userData.password,
      full_name: userData.name,
      user_type: userData.userType
    };
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    const result = await response.json();
    if (!response.ok) {
      console.error('Registration error:', result);
      throw new Error(result.message || 'Registration failed');
    }
    return result;
  },

  // ============================================================================
  // ADMIN ENDPOINTS
  // ============================================================================
  // Administrative functions for platform management
  getAllLenders: async () => {
    const response = await fetch(`${API_BASE_URL}/lenders`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  },

  getAllMortgages: async () => {
    const response = await fetch(`${API_BASE_URL}/mortgages/`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  },

  updateMortgageListing: async (listingId, listingData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/mortgages/${listingId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(listingData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to update listing');
    }
    return result;
  },

  deleteMortgageListing: async (listingId) => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/mortgages/${listingId}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || result.error || 'Failed to delete listing');
    }
    return { success: true };
  },

  submitMortgageApplication: async (applicationData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/homebuyer/applications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(applicationData)
    });
    
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to submit application');
    }
    return result;
  },

  updateBuyerProfile: async (profileData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/homebuyer/profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to update profile');
      } else {
        throw new Error(`Backend endpoint not implemented (HTTP ${response.status})`);
      }
    }
    
    const result = await response.json();
    return result;
  },

  getBuyerProfile: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/homebuyer/profile`, {
      headers
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to get profile');
      } else {
        throw new Error(`Backend endpoint not implemented (HTTP ${response.status})`);
      }
    }
    
    const result = await response.json();
    return result;
  },

  uploadDocument: async (documentData) => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('document', documentData.file);
    formData.append('type', documentData.type);
    
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/homebuyer/documents`, {
      method: 'POST',
      headers,
      body: formData
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to upload document');
    }
    return result;
  },

  getCreditworthiness: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/homebuyer/creditworthiness`, {
      headers
    });
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Failed to get creditworthiness');
      } else {
        throw new Error(`Backend endpoint not implemented (HTTP ${response.status})`);
      }
    }
    
    const result = await response.json();
    return result;
  },

  getBuyerMortgages: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    console.log('Fetching mortgages from:', `${API_BASE_URL}/homebuyer/my-mortgages`);
    const response = await fetch(`${API_BASE_URL}/homebuyer/my-mortgages`, {
      headers
    });
    
    console.log('Mortgages response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Raw mortgages response:', result);
    return result;
  },

  getBuyerApplications: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/homebuyer/applications`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  },

  getLenderProfile: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/lender/profile`, {
      headers
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to get lender profile');
    }
    return result;
  },

  updateLenderProfile: async (profileData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/lender/profile`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(profileData)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to update lender profile');
    }
    return result;
  },

  // ============================================================================
  // PAYMENT PROCESSING ENDPOINTS
  // ============================================================================
  
  /**
   * Process mortgage payment (down payment or monthly payment)
   * 
   * PAYMENT TYPES:
   * - Down Payment: Initial payment (typically 20%) that activates mortgage
   *   - Required before any monthly payments can be made
   *   - Updates mortgage status from 'approved' to 'active'
   *   - Starts the monthly payment schedule
   * 
   * - Monthly Payment: Regular scheduled payments
   *   - Due on the last day of each month
   *   - Calculated using amortization formula
   *   - Updates remaining balance and payment count
   * 
   * PAYMENT METHODS:
   * - M-Pesa: Mobile money (requires phone number)
   * - Credit/Debit Card: (requires card details)
   * - Bank Transfer: (requires account number)
   * 
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.mortgageId - ID of the mortgage
   * @param {number} paymentData.amount - Payment amount in KSH
   * @param {string} paymentData.paymentType - 'down' or 'monthly'
   * @param {string} paymentData.paymentMethod - 'mpesa', 'card', or 'bank'
   * @returns {Promise<Object>} Payment result with transaction ID and updated balance
   */
  processMortgagePayment: async (paymentData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/homebuyer/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const result = await response.json();
      console.error('Payment API error:', result);
      throw new Error(result.message || result.error || 'Payment failed');
    }
    
    return await response.json();
  },

  getPaymentHistory: async (mortgageId) => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/homebuyer/payments/${mortgageId}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  }
};

export default api;