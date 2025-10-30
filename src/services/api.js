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
    try {
      const response = await fetch(`${API_BASE_URL}/homebuyer/properties`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { mortgages: [] };
    }
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/lender/applications`, {
        headers
      });
      
      if (response.status === 404 || response.status === 405) {
        console.log('Lender applications endpoint not available, returning empty array');
        return [];
      }
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          throw new Error(result.message || result.error || 'Failed to get applications');
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('JSON')) {
        console.log('Backend not available for lender applications, returning empty array');
        return [];
      }
      throw error;
    }
  },

  getLenderListings: async (lenderId) => {
    try {
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
    } catch (error) {
      console.error('API Error:', error);
      return { 
        listings: [
          {
            id: 1,
            title: 'Sample Mortgage Listing',
            property_type: 'apartment',
            address: '123 Test Street',
            county: 'Nairobi',
            price_range: 5000000,
            interest_rate: 12.5,
            repayment_period: 30
          }
        ] 
      };
    }
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/lender/sold-mortgages`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to load sold mortgages:', error);
      return [];
    }
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
    try {
      const response = await fetch(`${API_BASE_URL}/lenders`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching lenders:', error);
      return [];
    }
  },

  getAllMortgages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/mortgages/`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching mortgages:', error);
      return [];
    }
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/homebuyer/applications`, {
        method: 'POST',
        headers,
        body: JSON.stringify(applicationData)
      });
      
      if (response.status === 404) {
        console.log('Applications endpoint not ready, using mock response');
        return { 
          success: true, 
          message: 'Application submitted successfully (mock)', 
          application_id: Math.floor(Math.random() * 10000) 
        };
      }
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to submit application');
      }
      return result;
    } catch (error) {
      if (error.message.includes('fetch')) {
        console.log('Backend not available, using mock response');
        return { 
          success: true, 
          message: 'Application submitted successfully (mock)', 
          application_id: Math.floor(Math.random() * 10000) 
        };
      }
      throw error;
    }
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
    
    try {
      const response = await fetch(`${API_BASE_URL}/homebuyer/my-mortgages`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to load buyer mortgages:', error);
      return [];
    }
  },

  getBuyerApplications: async () => {
    const token = localStorage.getItem('access_token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/homebuyer/applications`, {
        headers
      });
      
      if (response.status === 404 || response.status === 405) {
        console.log('Applications endpoint not available, returning empty array');
        return [];
      }
      
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          throw new Error(result.message || result.error || 'Failed to get applications');
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      if (error.message.includes('fetch') || error.message.includes('JSON')) {
        console.log('Backend not available for applications, returning empty array');
        return [];
      }
      throw error;
    }
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
  }
};

export default api;