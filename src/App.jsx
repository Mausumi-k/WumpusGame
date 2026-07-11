import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import GamePage from './pages/GamePage';
import LoginModal from './components/Modal/LoginModal';

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('wumpus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handlePlayClick = () => {
    if (user) {
      navigate('/game');
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    navigate('/game');
  };

  const handleLogout = () => {
    localStorage.removeItem('wumpus_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="app">
      <Navbar user={user} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<LandingPage onPlay={handlePlayClick} />} />
        <Route path="/game" element={<GamePage user={user} />} />
      </Routes>

      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin} 
        />
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
