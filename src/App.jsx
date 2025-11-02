/**
 * NetLend - Digital Mortgage Platform for Kenya
 * 
 * This is the main App component that serves as the root of the application.
 * It handles routing, authentication, and global state management for the entire platform.
 * 
 * Key Features:
 * - Multi-role authentication (Admin, Lender, Homebuyer)
 * - Protected routes with role-based access control
 * - Global toast notification system
 * - JWT token management and persistence
 * - Single Page Application (SPA) architecture
 */

// React core imports for component functionality and lifecycle management
import React, { useState, useEffect } from 'react';

// React Router imports for client-side routing and navigation
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

// HTTP client for API communication with backend services
import axios from 'axios';

// Layout components that provide consistent UI structure
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Dashboard components for different user roles
import LenderDashboard from './components/Lender/LenderDashboard';
import AdminDashboard from './components/AdminDashboard.jsx';
import HomebuyerDashboard from './components/Homebuyer/HomebuyerDashboard';

// Modal components for user authentication
import LoginModal from './components/Modals/LoginModal';
import RegisterModal from './components/Modals/RegisterModal';

// Public pages accessible to all users
import Properties from './components/Home/Properties';
import AboutUs from './components/Home/AboutUs';
import ContactUs from './components/Home/ContactUs';

// Utility components
import EligibilityCalculator from './components/Calculator/EligibilityCalculator';

// Global notification system for user feedback
import { ToastProvider, useToast } from './contexts/ToastContext';

// Application styling
import './styles/netlend.css';
import './index.css';

// Backend API base URL - connects to Flask/FastAPI backend
const API_BASE = 'http://localhost:5000/api';

/**
 * LoginPageWrapper Component
 * 
 * Wrapper component that adds toast notification functionality to the LoginPage.
 * This pattern allows us to inject toast notifications into existing components
 * without modifying their core logic.
 * 
 * Workflow:
 * 1. Intercepts login/register form submissions
 * 2. Makes API calls to backend authentication endpoints
 * 3. Shows appropriate toast notifications based on response
 * 4. Delegates to original handlers for state management
 */
const LoginPageWrapper = (props) => {
  // Access the global toast notification system
  const { showToast } = useToast();
  
  /**
   * Enhanced login handler with toast notifications
   * 
   * Process:
   * 1. Prevent default form submission
   * 2. Send POST request to /api/login endpoint
   * 3. Handle success/error responses with user feedback
   * 4. Call original login handler for state updates
   */
  const handleLoginWithToast = async (e) => {
    e.preventDefault();
    try {
      // Attempt authentication with backend
      const response = await axios.post(`${API_BASE}/login`, props.loginData);
      
      if (response.data.success) {
        // Success: Show positive feedback and proceed
        showToast('Login successful!', 'success');
        props.handleLogin(e);
      } else {
        // Backend returned error message
        showToast('Login failed: ' + (response.data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      // Network or other errors
      showToast('Login failed: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  /**
   * Enhanced registration handler with toast notifications
   * 
   * Similar to login but for new user registration
   */
  const handleRegisterWithToast = async (e) => {
    e.preventDefault();
    try {
      // Attempt user registration with backend
      const response = await axios.post(`${API_BASE}/register`, props.registerData);
      
      if (response.data.success) {
        // Success: Show positive feedback and proceed
        showToast('Registration successful!', 'success');
        props.handleRegister(e);
      } else {
        // Backend returned error message
        showToast('Registration failed: ' + (response.data.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      // Network or validation errors
      showToast('Registration failed: ' + (error.response?.data?.error || error.message), 'error');
    }
  };

  // Render the original LoginPage with enhanced handlers
  return <LoginPage {...props} handleLogin={handleLoginWithToast} handleRegister={handleRegisterWithToast} />;
};

/**
 * LoginPage Component
 * 
 * Dedicated page for admin authentication. This component provides
 * a clean interface for admin users to log in or register.
 * 
 * Features:
 * - Toggle between login and registration forms
 * - Automatic redirection for authenticated admin users
 * - Form validation and controlled inputs
 * - Integration with backend authentication system
 */
const LoginPage = React.memo(({ isLogin, setIsLogin, loginData, setLoginData, registerData, setRegisterData, handleLogin, handleRegister, user }) => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  /**
   * Auto-redirect authenticated admin users to their dashboard
   * This prevents authenticated users from seeing the login page
   */
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

/**
 * AdminNavigationWrapper Component
 * 
 * Wrapper component that provides navigation functionality to the AdminDashboard.
 * This component handles the complex routing logic needed for admin users
 * to navigate between different sections while maintaining their admin context.
 * 
 * Purpose:
 * - Bridges admin dashboard with main app navigation
 * - Preserves admin state during section changes
 * - Provides clean separation of concerns
 */
const AdminNavigationWrapper = ({ user, onLogout, setCurrentSection }) => {
  // Navigation hook for programmatic routing
  const navigate = useNavigate();
  
  /**
   * Handle section navigation for admin users
   * 
   * Process:
   * 1. Update the current section in parent state
   * 2. Navigate to home route with section state
   * 3. Preserve admin context with preserveAdmin flag
   */
  const handleShowSection = (section) => {
    setCurrentSection(section);
    navigate('/', { state: { section, preserveAdmin: true } });
  };
  
  // Render AdminDashboard with enhanced navigation capabilities
  return <AdminDashboard user={user} onLogout={onLogout} onShowSection={handleShowSection} />;
};

/**
 * Main App Component
 * 
 * This is the root component of the NetLend application. It manages:
 * - Global application state (user authentication, current section)
 * - Routing and navigation logic
 * - Authentication workflows
 * - Modal state management
 * 
 * State Management Strategy:
 * - Uses React hooks for local state management
 * - Context API for global notifications
 * - localStorage for authentication persistence
 * 
 * Architecture Pattern:
 * - Single Page Application (SPA) with client-side routing
 * - Role-based access control
 * - Modular component structure
 */
function App() {
  // === AUTHENTICATION STATE ===
  // Current authenticated user object (null if not logged in)
  const [user, setUser] = useState(null);
  
  // === FORM STATE ===
  // Toggle between login and registration forms
  const [isLogin, setIsLogin] = useState(true);
  
  // Login form data with default admin user type
  const [loginData, setLoginData] = useState({ email: '', password: '', userType: 'admin' });
  
  // Registration form data with default admin user type
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', userType: 'admin' });
  
  // === NAVIGATION STATE ===
  // Current active section of the application
  const [currentSection, setCurrentSection] = useState('home');
  
  // === MODAL STATE ===
  // Control visibility of authentication modals
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  /**
   * Handle user login authentication
   * 
   * Workflow:
   * 1. Prevent default form submission behavior
   * 2. Send login credentials to backend API
   * 3. On success: Store user data and JWT token
   * 4. Set up authorization header for future API calls
   * 5. Update application state with authenticated user
   * 
   * Security Features:
   * - JWT token stored in localStorage for persistence
   * - Authorization header automatically added to all axios requests
   * - User object contains role information for access control
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login attempt:', loginData);
    
    try {
      // Send authentication request to backend
      const response = await axios.post(`${API_BASE}/login`, loginData);
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        // Authentication successful - update application state
        setUser(response.data.user);
        
        // Persist authentication token for future sessions
        localStorage.setItem('token', response.data.token);
        
        // Set up automatic authorization for all future API calls
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('Login successful, user set:', response.data.user);
      } else {
        // Error handling delegated to toast wrapper component
      }
    } catch (error) {
      console.error('Login error:', error);
      // Error handling delegated to toast wrapper component
    }
  };

  /**
   * Handle user registration
   * 
   * Similar to login but creates a new user account first.
   * After successful registration, automatically logs the user in.
   * 
   * Workflow:
   * 1. Prevent default form submission
   * 2. Send registration data to backend API
   * 3. Backend creates new user account
   * 4. On success: Automatically authenticate the new user
   * 5. Set up session just like in login process
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Register attempt:', registerData);
    
    try {
      // Send registration request to backend
      const response = await axios.post(`${API_BASE}/register`, registerData);
      console.log('Register response:', response.data);
      
      if (response.data.success) {
        // Registration successful - automatically log in the new user
        setUser(response.data.user);
        
        // Persist authentication token
        localStorage.setItem('token', response.data.token);
        
        // Set up automatic authorization for API calls
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('Registration successful, user set:', response.data.user);
      } else {
        // Error handling delegated to toast wrapper component
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error handling delegated to toast wrapper component
    }
  };

  /**
   * Handle login from modal components
   * 
   * This function is called when users successfully log in through
   * the modal dialogs (not the dedicated admin login page).
   * 
   * Role-based Navigation:
   * - Lenders → Dashboard with lender-specific features
   * - Homebuyers → Dashboard with buyer-specific features  
   * - Admins → Dashboard with admin-specific features
   * - Others → Home page (fallback)
   */
  const handleModalLogin = (userData) => {
    // Update global user state
    setUser(userData);
    
    // Navigate based on user role
    if (userData.user_type === 'lender' || userData.user_type === 'homebuyer' || userData.userType === 'admin') {
      setCurrentSection('dashboard');
    } else {
      setCurrentSection('home');
    }
  };

  /**
   * Handle user logout
   * 
   * Complete cleanup of user session and authentication state.
   * 
   * Cleanup Process:
   * 1. Clear user object from application state
   * 2. Navigate back to home page
   * 3. Remove JWT token from localStorage
   * 4. Remove authorization header from axios defaults
   * 
   * Security: Ensures no authentication data persists after logout
   */
  const handleLogout = () => {
    // Clear user state
    setUser(null);
    
    // Navigate to public area
    setCurrentSection('home');
    
    // Remove persisted authentication token
    localStorage.removeItem('token');
    
    // Remove authorization header from future API calls
    delete axios.defaults.headers.common['Authorization'];
  };

  /**
   * Navigate to a specific section of the application
   * 
   * Simple navigation helper used by various components
   * to change the current active section.
   */
  const showSection = (section) => {
    setCurrentSection(section);
  };

  /**
   * Initialize authentication on app startup
   * 
   * This effect runs once when the app loads and checks for
   * a persisted authentication token. If found, it sets up
   * the authorization header for API calls.
   * 
   * This enables "remember me" functionality - users stay
   * logged in across browser sessions.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Restore authorization header for API calls
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  /**
   * MainApp Component
   * 
   * The main application shell that renders different sections based on
   * current state and user authentication status.
   * 
   * Features:
   * - Conditional rendering based on currentSection state
   * - Role-based dashboard rendering
   * - Modal management for authentication
   * - Navigation state synchronization with URL
   */
  const MainApp = () => {
    // React Router hooks for navigation and location awareness
    const location = useLocation();
    const navigate = useNavigate();
    
    /**
     * Synchronize URL state with application state
     * 
     * When navigation occurs with state (e.g., from admin wrapper),
     * update the current section to match.
     */
    useEffect(() => {
      if (location.state?.section) {
        setCurrentSection(location.state.section);
      }
    }, [location.state]);
    
    /**
     * Handle dashboard navigation for admin users
     * 
     * Admin users have a dedicated route (/admin) separate from
     * the main application sections.
     */
    const handleShowDashboard = () => {
      if (user?.userType === 'admin') {
        navigate('/admin');
      }
    };
    
    return (
    <div className="App">
      {/* 
        Global Navigation Bar
        - Shows different options based on user authentication status
        - Handles modal triggers for login/register
        - Provides navigation to different sections
      */}
      <Navbar 
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onShowSection={showSection}
        onRegister={() => setShowRegisterModal(true)}
        onShowDashboard={handleShowDashboard}
      />
      
      {/* 
        ROLE-BASED DASHBOARD RENDERING
        Only authenticated users see their respective dashboards
      */}
      
      {/* Lender Dashboard - Mortgage management, applications, analytics */}
      {currentSection === 'dashboard' && user && user.user_type === 'lender' && (
        <LenderDashboard user={user} />
      )}
      
      {/* Homebuyer Dashboard - Property search, applications, mortgage tracking */}
      {currentSection === 'dashboard' && user && user.user_type === 'homebuyer' && (
        <HomebuyerDashboard user={user} onLogout={handleLogout} />
      )}
      
      {/* 
        PUBLIC PAGES
        Accessible to all users regardless of authentication status
      */}
      
      {/* Home/Properties Page - Main landing page with property listings */}
      {currentSection === 'home' && (
        <Properties 
          user={user}
          onShowRegister={() => setShowRegisterModal(true)}
          onShowLogin={() => setShowLoginModal(true)}
          onShowContact={() => setCurrentSection('contact')}
        />
      )}
      
      {/* About Us Page - Company information and mission */}
      {currentSection === 'about' && (
        <AboutUs 
          onShowRegister={() => setShowRegisterModal(true)}
          onShowContact={() => setCurrentSection('contact')}
        />
      )}
      
      {/* Contact Us Page - Contact information and inquiry forms */}
      {currentSection === 'contact' && <ContactUs />}

      {/* Eligibility Calculator - Mortgage qualification tool */}
      {currentSection === 'eligibility-calculator' && <EligibilityCalculator user={user} />}
      
      {/* 
        AUTHENTICATION MODALS
        Overlay components for user login and registration
      */}
      
      {/* Login Modal - User authentication dialog */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleModalLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      
      {/* Registration Modal - New user signup dialog */}
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleModalLogin}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      
      {/* Global Footer - Always visible at bottom of page */}
      <Footer />
    </div>
  );
  };

  /**
   * APPLICATION ROOT RENDER
   * 
   * The main return statement that sets up the complete application structure:
   * 
   * 1. ToastProvider - Global notification system wrapper
   * 2. BrowserRouter - Enables client-side routing
   * 3. Routes - Defines all application routes with protection
   * 
   * Route Structure:
   * - / : Main application (public + authenticated sections)
   * - /admin-login : Dedicated admin authentication page
   * - /admin : Protected admin dashboard (requires admin role)
   * - /lender : Protected lender dashboard (requires lender role)
   * - /* : Catch-all fallback to main app
   */
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Application Route - Handles all public and most authenticated content */}
          <Route path="/" element={<MainApp />} />
          
          {/* Dedicated Admin Login Page - Separate from modal-based auth */}
          <Route 
            path="/admin-login" 
            element={
              <LoginPageWrapper 
                isLogin={isLogin} 
                setIsLogin={setIsLogin} 
                loginData={loginData} 
                setLoginData={setLoginData} 
                registerData={registerData} 
                setRegisterData={setRegisterData} 
                handleLogin={handleLogin} 
                handleRegister={handleRegister} 
                user={user} 
              />
            } 
          />
          
          {/* Protected Admin Dashboard Route */}
          <Route 
            path="/admin" 
            element={
              // Route Guard: Only authenticated admin users can access
              user && user.userType === 'admin' 
                ? <AdminNavigationWrapper 
                    user={user} 
                    onLogout={handleLogout} 
                    setCurrentSection={setCurrentSection} 
                  /> 
                : <Navigate to="/admin-login" /> // Redirect unauthorized users
            } 
          />
          
          {/* Protected Lender Dashboard Route */}
          <Route 
            path="/lender" 
            element={
              // Route Guard: Only authenticated lender users can access
              user && user.userType === 'lender' 
                ? <LenderDashboard user={user} onLogout={handleLogout} /> 
                : <Navigate to="/" /> // Redirect unauthorized users to home
            } 
          />
          
          {/* Catch-all Route - Fallback to main application */}
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

// Export the App component as the default export
// This makes it available for import in index.js to render the entire application
export default App;