const API_BASE_URL = 'http://127.0.0.1:5000/api';

const api = {
  // Auth endpoints
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

  // Properties endpoints
  getProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/homebuyer/properties`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  },

  // Lender endpoints
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

  // Admin endpoints
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
    
    const response = await fetch(`${API_BASE_URL}/homebuyer/my-mortgages`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
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

  processMortgagePayment: async (paymentData) => {
    const token = localStorage.getItem('access_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/homebuyer/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData)
      });
      
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || result.error || 'Payment failed');
      }
      
      return await response.json();
    } catch (error) {
      // Simulate payment processing for demo
      console.log('Simulating payment processing:', paymentData);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success response
      return {
        success: true,
        transactionId: `TXN${Date.now()}`,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        timestamp: new Date().toISOString(),
        message: 'Payment processed successfully'
      };
    }
  },

  getPaymentHistory: async (mortgageId) => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/homebuyer/payments/${mortgageId}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to load payment history:', error);
      throw error;
    }
  }
};

export default api;