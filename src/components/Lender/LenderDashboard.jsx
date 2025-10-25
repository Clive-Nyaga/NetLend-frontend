import { useState } from 'react';
import MyListings from './MyListings';
import LenderApplications from './LenderApplications';
import Messages from './Messages';
import LenderProfile from './LenderProfile';
import Analytics from './Analytics';
import '../../styles/netlend.css';

const LenderDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('listings');

  const showSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Lender Portal</h3>
        <ul>
          <li><a onClick={() => setActiveSection('listings')} className={activeSection === 'listings' ? 'active' : ''}>My Listings</a></li>
          <li><a onClick={() => setActiveSection('applications')} className={activeSection === 'applications' ? 'active' : ''}>Applications</a></li>
          <li><a onClick={() => setActiveSection('messages')} className={activeSection === 'messages' ? 'active' : ''}>Messages</a></li>
          <li><a onClick={() => setActiveSection('profile')} className={activeSection === 'profile' ? 'active' : ''}>Profile</a></li>
          <li><a onClick={() => setActiveSection('analytics')} className={activeSection === 'analytics' ? 'active' : ''}>Analytics</a></li>
          <li><a onClick={onLogout}>Logout</a></li>
        </ul>
      </div>
      
      <div className="main-content">
        {activeSection === 'listings' && <MyListings lenderId={user?.id} />}
        {activeSection === 'applications' && <LenderApplications lenderId={user?.id} />}
        {activeSection === 'messages' && <Messages lenderId={user?.id} />}
        {activeSection === 'profile' && <LenderProfile user={user} />}
        {activeSection === 'analytics' && <Analytics lenderId={user?.id} />}
      </div>
    </div>
  );
};

export default LenderDashboard;