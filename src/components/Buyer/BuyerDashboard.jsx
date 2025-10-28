import { useState } from 'react';
import MyApplications from './MyApplications';
import PropertySearch from './PropertySearch';
import Messages from './Messages';
import BuyerProfile from './BuyerProfile';

const BuyerDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('search');

  return (
    <div className="container">
      <h2>Buyer Portal</h2>
      <div className="nav-tabs">
        <a 
          className={activeSection === 'search' ? 'active' : ''} 
          onClick={() => setActiveSection('search')}
        >
          Property Search
        </a>
        <a 
          className={activeSection === 'applications' ? 'active' : ''} 
          onClick={() => setActiveSection('applications')}
        >
          My Applications
        </a>
        <a 
          className={activeSection === 'messages' ? 'active' : ''} 
          onClick={() => setActiveSection('messages')}
        >
          Messages
        </a>
        <a 
          className={activeSection === 'profile' ? 'active' : ''} 
          onClick={() => setActiveSection('profile')}
        >
          Profile
        </a>
      </div>
      
      <div className="tab-content">
        {activeSection === 'search' && <PropertySearch buyerId={user?.id} />}
        {activeSection === 'applications' && <MyApplications buyerId={user?.id} />}
        {activeSection === 'messages' && <Messages buyerId={user?.id} />}
        {activeSection === 'profile' && <BuyerProfile user={user} />}
      </div>
    </div>
  );
};

export default BuyerDashboard;