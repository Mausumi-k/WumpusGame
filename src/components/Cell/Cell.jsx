import React from 'react';
import { motion } from 'framer-motion';
import './Cell.css';

const Cell = ({ cell, playerPos }) => {
  const isPlayerHere = playerPos.x === cell.x && playerPos.y === cell.y;
  
  // Fog of war
  if (!cell.visited && !isPlayerHere) {
    return (
      <div className="cell cell-unvisited">
        <span className="fog-icon">?</span>
      </div>
    );
  }

  // Define what to show if visited
  let content = '';
  if (isPlayerHere) content = '🤠'; // Player icon
  else if (cell.wumpus) content = '👹';
  else if (cell.pit) content = '🕳️';
  else if (cell.gold) content = '💰';

  // Percepts icons
  const percepts = [];
  if (cell.breeze) percepts.push('💨');
  if (cell.stench) percepts.push('〰️');
  if (cell.glitter) percepts.push('✨');

  return (
    <motion.div 
      className={`cell cell-visited ${isPlayerHere ? 'cell-player' : ''}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="cell-content">
        {content}
      </div>
      
      {/* Percepts HUD within cell */}
      <div className="cell-percepts">
        {percepts.map((p, idx) => (
          <span key={idx} className="percept-icon">{p}</span>
        ))}
      </div>
    </motion.div>
  );
};

export default Cell;
