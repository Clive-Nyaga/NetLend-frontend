import { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import LenderDashboard from './components/Lender/LenderDashboard';
import LoginModal from './components/Modals/LoginModal';
import './styles/netland.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentSection('dashboard');
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
      />
      
      {user && user.type === 'lender' && currentSection === 'dashboard' && (
        <LenderDashboard user={user} />
      )}
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;