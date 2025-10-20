import { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import LenderDashboard from './components/Lender/LenderDashboard';
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

function App() {
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.user_type === 'lender') {
      setCurrentSection('dashboard');
    } else {
      setCurrentSection('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSection('properties');
  };

  const showSection = (section) => {
    setCurrentSection(section);
  };

  return (
    <div className="App">
      <Navbar 
        user={user}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onShowSection={showSection}
        onRegister={() => setShowRegisterModal(true)}
      />
      
      {!user && (
        <>
          {currentSection === 'home' && <Properties />}
          {currentSection === 'about' && <AboutUs />}
          {currentSection === 'contact' && <ContactUs />}
        </>
      )}
      
      {user && user.user_type === 'lender' && currentSection === 'dashboard' && (
        <LenderDashboard user={user} />
      )}
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      
      <RegisterModal 
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleLogin}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
      
      <Footer />
    </div>
  );
}

export default App;