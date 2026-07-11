import React, { useState } from 'react';
import './LoginModal.css';
import { motion } from 'framer-motion';

const LoginModal = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError('Please enter both username and password.');
      return;
    }
    
    // Simple local storage login
    const user = { username };
    localStorage.setItem('wumpus_user', JSON.stringify(user));
    onLogin(user);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <motion.div 
        className="modal-content pixel-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h2>Adventurer Login</h2>
        <p>Save your stats locally.</p>
        
        {error && <p className="error-text">{error}</p>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Hero123"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="****"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Enter Dungeon</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginModal;
