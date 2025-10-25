import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Layout/Navbar';
import LenderDashboard from './components/Lender/LenderDashboard';
import AdminDashboard from './components/AdminDashboard.jsx';
import LoginModal from './components/Modals/LoginModal';
import RegisterModal from './components/Modals/RegisterModal';
import Properties from './components/Home/Properties';
import AboutUs from './components/Home/AboutUs';
import ContactUs from './components/Home/ContactUs';
import Footer from './components/Layout/Footer';
import MortgageCalculator from './components/Calculator/MortgageCalculator';
import AffordabilityCalculator from './components/Calculator/AffordabilityCalculator';
import LoanComparison from './components/Calculator/LoanComparison';
import './styles/netlend.css';
import './index.css';

const API_BASE = 'http://localhost:5000/api';

const LoginPage = React.memo(({ isLogin, setIsLogin, loginData, setLoginData, registerData, setRegisterData, handleLogin, handleRegister, user }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user && user.userType === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);
  
  return (
  <div className="about-page-wrapper">
    <div className="container">
      <h2 className="page-title">NetLend Admin - {isLogin ? 'Login' : 'Register'}</h2>
    
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <button 
        className={`btn ${isLogin ? '' : 'warning'}`} 
        onClick={() => setIsLogin(true)}
        style={{ marginRight: '1rem' }}
      >
        Login
      </button>
      <button 
        className={`btn ${!isLogin ? '' : 'warning'}`} 
        onClick={() => setIsLogin(false)}
      >
        Register
      </button>
    </div>

    {isLogin ? (
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={loginData.email}
            onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
            required
          />
        </div>
        <div className="form-group">
          <label>User Type</label>
          <select
            value={loginData.userType}
            onChange={(e) => setLoginData(prev => ({...prev, userType: e.target.value}))}
          >
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    ) : (
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={registerData.name}
            onChange={(e) => setRegisterData(prev => ({...prev, name: e.target.value}))}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={registerData.email}
            onChange={(e) => setRegisterData(prev => ({...prev, email: e.target.value}))}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData(prev => ({...prev, password: e.target.value}))}
            required
          />
        </div>
        <div className="form-group">
          <label>User Type</label>
          <select
            value={registerData.userType}
            onChange={(e) => setRegisterData(prev => ({...prev, userType: e.target.value}))}
          >
            <option value="admin">Administrator</option>
          </select>
        </div>
        <button type="submit" className="btn success">Register</button>
      </form>
    )}
    
      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <p>Test Admin: admin@netland.com</p>
        <p>API Documentation: <a href="http://localhost:5000/docs" target="_blank" rel="noopener noreferrer">View Docs</a></p>
      </div>
    </div>
  </div>
);
});

const AdminNavigationWrapper = ({ user, onLogout, setCurrentSection }) => {
  const navigate = useNavigate();
  
  const handleShowSection = (section) => {
    setCurrentSection(section);
    navigate('/', { state: { section, preserveAdmin: true } });
  };
  
  return <AdminDashboard user={user} onLogout={onLogout} onShowSection={handleShowSection} />;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '', userType: 'admin' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', userType: 'admin' });
  const [currentSection, setCurrentSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginData);
    try {
      const response = await axios.post(`${API_BASE}/login`, loginData);
      console.log('Login response:', response.data);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Login successful, user set:', response.data.user);
      } else {
        alert('Login failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register attempt:', registerData);
    try {
      const response = await axios.post(`${API_BASE}/register`, registerData);
      console.log('Register response:', response.data);
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('Registration successful, user set:', response.data.user);
      } else {
        alert('Registration failed: ' + (response.data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleModalLogin = (userData) => {
    setUser(userData);
    if (userData.user_type === 'lender') {
      setCurrentSection('dashboard');
    } else {
      setCurrentSection('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSection('home');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const showSection = (section) => {
    setCurrentSection(section);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const MainApp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (location.state?.section) {
        setCurrentSection(location.state.section);
      }
    }, [location.state]);
    
    const handleShowDashboard = () => {
      if (user?.userType === 'admin') {
        navigate('/admin');
      }
    };
    
    return (
    <div className="App">
      <Navbar 
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onShowSection={showSection}
        onRegister={() => setShowRegisterModal(true)}
        onShowDashboard={handleShowDashboard}
      />
      
      {currentSection === 'dashboard' && user && user.user_type === 'lender' && (
        <LenderDashboard user={user} />
      )}
      
      {currentSection === 'home' && <Properties />}
      {currentSection === 'about' && <AboutUs />}
      {currentSection === 'contact' && <ContactUs />}
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleModalLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleModalLogin}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      
      <Footer />
    </div>
  );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/admin-login" element={<LoginPage isLogin={isLogin} setIsLogin={setIsLogin} loginData={loginData} setLoginData={setLoginData} registerData={registerData} setRegisterData={setRegisterData} handleLogin={handleLogin} handleRegister={handleRegister} user={user} />} />
        <Route 
          path="/admin" 
          element={
            user && user.userType === 'admin' 
              ? <AdminNavigationWrapper user={user} onLogout={handleLogout} setCurrentSection={setCurrentSection} /> 
              : <Navigate to="/admin-login" />
          } 
        />
        <Route 
          path="/lender" 
          element={
            user && user.userType === 'lender' 
              ? <LenderDashboard user={user} onLogout={handleLogout} /> 
              : <Navigate to="/" />
          } 
        />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;