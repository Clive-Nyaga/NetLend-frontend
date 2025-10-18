import { useState } from 'react';
import MortgageProducts from './MortgageProducts';
import LenderApplications from './LenderApplications';
import Refinancing from './Refinancing';

const LenderDashboard = ({ user }) => {
  const [activeSection, setActiveSection] = useState('products');

  const showSection = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Lender Portal</h3>
        <ul>
          <li><a onClick={() => showSection('products')}>Mortgage Products</a></li>
          <li><a onClick={() => showSection('applications')}>Applications</a></li>
          <li><a onClick={() => showSection('refinancing')}>Refinancing</a></li>
        </ul>
      </div>
      
      <div className="main-content">
        {activeSection === 'products' && <MortgageProducts lenderId={user?.id} />}
        {activeSection === 'applications' && <LenderApplications lenderId={user?.id} />}
        {activeSection === 'refinancing' && <Refinancing />}
      </div>
    </div>
  );
};

export default LenderDashboard;