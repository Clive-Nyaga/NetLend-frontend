import { useState } from 'react';

const Navbar = ({ user, onLogin, onLogout, onShowSection, onRegister, onShowDashboard }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-placeholder"></div>
        <h1>NetLend</h1>
      </div>
      {!user ? (
        <div className="nav-links">
          <a onClick={() => onShowSection('home')}>Home</a>
          <a onClick={() => onShowSection('about')}>About Us</a>
          <a onClick={() => onShowSection('contact')}>Contact Us</a>
          <a onClick={onLogin}>Login</a>
          <a onClick={onRegister}>Register</a>
        </div>
      ) : (
        <>
          {(user.user_type === 'lender' || user.userType === 'admin') && (
            <div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', color: 'var(--primary-color)', fontWeight: '600', fontSize: '1.1rem'}}>
              Welcome,&nbsp;{(user.contact_person || user.name || '').split(' ')[0]} 🎉
            </div>
          )}
          <div className="nav-links">
            <a onClick={() => onShowSection('home')}>Home</a>
            <a onClick={() => onShowSection('about')}>About Us</a>
            <a onClick={() => onShowSection('contact')}>Contact Us</a>
            {user.user_type === 'lender' && <a onClick={() => onShowSection('dashboard')}>Dashboard</a>}
            {user.userType === 'admin' ? (
              <a onClick={onShowDashboard}>Dashboard</a>
            ) : (
              <a onClick={onLogout}>Logout</a>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;