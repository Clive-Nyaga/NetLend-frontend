import { useState } from 'react';
import api from '../../services/api';

const LoginModal = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.login(formData);
      console.log('Login response:', response);
      if (response.lender && response.access_token) {
        // Store token in localStorage
        localStorage.setItem('access_token', response.access_token);
        // Add user_type to lender object for routing
        const userData = {
          ...response.lender,
          user_type: 'lender',
          access_token: response.access_token
        };
        onLogin(userData);
        onClose();
      } else {
        setError('Login failed: Invalid response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Login</h2>
        {error && (
          <div style={{background: '#fee2e2', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem'}}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{textAlign: 'center', marginTop: '1rem'}}>
          Don't have an account? <a onClick={onSwitchToRegister} style={{color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline'}}>Register</a>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;