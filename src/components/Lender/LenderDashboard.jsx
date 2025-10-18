import { useState } from 'react';
import MyListings from './MyListings';
import LenderApplications from './LenderApplications';
import Messages from './Messages';
import LenderProfile from './LenderProfile';
import Analytics from './Analytics';

const LenderDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('listings');

  const showSection = (section) => {
    setActiveSection(section);
  };

  return (
    <>
      <div className="container">
        <h2>Lender Portal</h2>
        <div className="nav-tabs">
          <a 
            className={activeSection === 'listings' ? 'active' : ''} 
            onClick={() => showSection('listings')}
          >
            My Listings
          </a>
          <a 
            className={activeSection === 'applications' ? 'active' : ''} 
            onClick={() => showSection('applications')}
          >
            Applications
          </a>
          <a 
            className={activeSection === 'messages' ? 'active' : ''} 
            onClick={() => showSection('messages')}
          >
            Messages
          </a>
          <a 
            className={activeSection === 'profile' ? 'active' : ''} 
            onClick={() => showSection('profile')}
          >
            Profile
          </a>
          <a 
            className={activeSection === 'analytics' ? 'active' : ''} 
            onClick={() => showSection('analytics')}
          >
            Analytics
          </a>
        </div>
        
        <div className="tab-content">
          {activeSection === 'listings' && <MyListings lenderId={user?.id} />}
          {activeSection === 'applications' && <LenderApplications lenderId={user?.id} />}
          {activeSection === 'messages' && <Messages lenderId={user?.id} />}
          {activeSection === 'profile' && <LenderProfile user={user} />}
          {activeSection === 'analytics' && <Analytics lenderId={user?.id} />}
        </div>
      </div>
    </>
  );
};

export default LenderDashboard;