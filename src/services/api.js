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
    const response = await fetch(`${API_BASE_URL}/lender/${lenderId}/applications`);
    return response.json();
  },

  getLenderListings: async (lenderId) => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      console.log('Fetching listings for lender:', lenderId);
      const response = await fetch(`${API_BASE_URL}/lender/${lenderId}/mortgages`, {
        headers
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Backend response data:', data);
      return data;
    } catch (error) {
      console.error('API Error:', error);
      // Return mock data for testing
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

  updateApplicationStatus: async (applicationId, status) => {
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
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
    const response = await fetch(`${API_BASE_URL}/applications`, {
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
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to update profile');
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to get profile');
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to get creditworthiness');
    }
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
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Failed to get mortgages');
    }
    return result;
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