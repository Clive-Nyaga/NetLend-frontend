import { useState } from 'react';

const Navbar = ({ user, onLogin, onLogout, onShowSection }) => {
  return (
    <nav className="navbar">
      <h1>Netland</h1>
      {!user ? (
        <div className="nav-links">
          <a onClick={() => onShowSection('properties')}>Properties</a>
          <a onClick={() => onShowSection('calculator')}>Calculator</a>
          <a onClick={() => onShowSection('affordability')}>Affordability</a>
          <a onClick={() => onShowSection('comparison')}>Compare</a>
          <a onClick={onLogin}>Login</a>
        </div>
      ) : (
        <div className="nav-links">
          <span id="welcomeUser">Welcome, {user.name}</span>
          <a onClick={() => onShowSection('dashboard')}>Dashboard</a>
          <a onClick={onLogout}>Logout</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;