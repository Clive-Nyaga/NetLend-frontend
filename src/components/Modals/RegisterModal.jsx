import { useState } from 'react';
import api from '../../services/api';
import TermsModal from './TermsModal';

const RegisterModal = ({ isOpen, onClose, onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'buyer',
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {
      alert('You must agree to the Terms and Conditions to proceed.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.register(formData);
      console.log('Registration response:', response);
      console.log('User type:', formData.userType);
      console.log('Response keys:', Object.keys(response));
      if (response.message === 'Registration successful') {
        // Registration successful, now auto-login the user
        try {
          const loginResponse = await api.login({
            email: formData.email,
            password: formData.password
          });
          console.log('Auto-login response:', loginResponse);
          
          if (formData.userType === 'lender' && loginResponse.lender) {
            // Store token for lenders
            if (loginResponse.access_token) {
              localStorage.setItem('access_token', loginResponse.access_token);
            }
            const userData = {
              ...loginResponse.lender,
              user_type: 'lender',
              access_token: loginResponse.access_token
            };
            onRegister(userData);
          } else {
            // Handle homebuyer login
            const userData = loginResponse.user || loginResponse;
            onRegister(userData);
          }
          onClose();
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          alert('Registration successful! Please log in manually.');
          onClose();
        }
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content" style={{maxHeight: '90vh', overflow: 'hidden'}}>
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Register</h2>
        <div style={{maxHeight: '75vh', overflowY: 'auto', paddingRight: '1rem'}}>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          <div className="form-group">
            <label>User Type</label>
            <select 
              name="userType"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="buyer">Buyer</option>
              <option value="lender">Lender</option>
            </select>
          </div>
          <div className="terms-section">
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <label htmlFor="agreeToTerms">
                I agree to the <a onClick={() => setShowTermsModal(true)} style={{color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline'}}>Terms and Conditions</a>
              </label>
            </div>
          </div>
            <button type="submit" className="btn" disabled={loading || !formData.agreeToTerms}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <p style={{textAlign: 'center', marginTop: '1rem'}}>
            Already have an account? <a onClick={onSwitchToLogin} style={{color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline'}}>Login</a>
          </p>
        </div>
      </div>
      
      <TermsModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
};

export default RegisterModal;