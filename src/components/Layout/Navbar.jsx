import { useState } from 'react';

const Navbar = ({ user, onLogin, onLogout, onShowSection, onRegister }) => {
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