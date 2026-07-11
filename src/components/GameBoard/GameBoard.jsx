import React from 'react';
import Cell from '../Cell/Cell';
import './GameBoard.css';

const GameBoard = ({ board, size, playerPos }) => {
  return (
    <div 
      className="game-board pixel-border" 
      style={{ 
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`
      }}
    >
      {board.map((row, y) => (
        row.map((cell, x) => (
          <Cell 
            key={cell.id} 
            cell={cell} 
            playerPos={playerPos} 
          />
        ))
      ))}
    </div>
  );
};

export default GameBoard;
