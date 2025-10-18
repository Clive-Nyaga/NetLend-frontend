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
    return response.json();
  },

  // Properties endpoints
  getProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/mortgages/`);
    return response.json();
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
  }
};

export default api;