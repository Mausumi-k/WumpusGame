import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar pixel-border">
      <div className="navbar-logo">
        <h1>Wumpus Quest</h1>
      </div>
      <div className="navbar-links">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.username}!</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        ) : (
          <span>Not Logged In</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
