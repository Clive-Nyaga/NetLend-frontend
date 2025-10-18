import { useState } from 'react';

const Navbar = ({ user, onLogin, onLogout, onShowSection }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="logo-placeholder"></div>
        <h1>NetLend</h1>
      </div>
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