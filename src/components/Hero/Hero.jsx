import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = ({ onPlay }) => {
  return (
    <div className="hero-container">
      <motion.div 
        className="hero-content pixel-border"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="hero-title">Wumpus Quest</h1>
        <p className="hero-subtitle">Descend into the dark, find the gold, and beware the Wumpus.</p>
        
        <div className="hero-story">
          <p>
            You are a brave adventurer entering a mysterious dungeon. 
            The legendary Wumpus lurks in the shadows, and deadly pits surround you.
            Rely on your senses: feel the breeze of pits, smell the stench of the monster, and look for the glitter of gold!
          </p>
        </div>

        <button className="btn-primary btn-large" onClick={onPlay}>
          START ADVENTURE
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
