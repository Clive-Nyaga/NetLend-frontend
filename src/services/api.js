const API_BASE_URL = 'http://127.0.0.1:5000';

const api = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },

  // Properties endpoints
  getProperties: async () => {
    const response = await fetch(`${API_BASE_URL}/properties`);
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
  }
};

export default api;