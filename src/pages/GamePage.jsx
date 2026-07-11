import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameBoard from '../components/GameBoard/GameBoard';
import { generateBoard } from '../engine/generator';
import { movePlayer, isValidMove } from '../engine/movement';
import { solveStep } from '../engine/aiSolver';
import { saveScore } from '../utils/storage';

const GamePage = ({ user }) => {
  const [size, setSize] = useState(6); // Default 6x6
  const [board, setBoard] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 5 }); // Bottom-left for 6x6
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game Rules State
  const [gameState, setGameState] = useState('PLAYING'); // PLAYING, WON, LOST
  const [arrows, setArrows] = useState(1);
  const [wumpusAlive, setWumpusAlive] = useState(true);
  const [hasGold, setHasGold] = useState(false);
  const [deathMessage, setDeathMessage] = useState('');
  const [score, setScore] = useState(0);
  
  // AI State
  const aiStateRef = useRef({ visitedList: new Set(), knownSafe: new Set(), knownDanger: new Set() });

  const initGame = (newSize = 6) => {
    setSize(newSize);
    const numPits = newSize === 4 ? 2 : newSize === 6 ? 4 : 8;
    const newBoard = generateBoard(newSize, numPits);
    setBoard(newBoard);
    setPlayerPos({ x: 0, y: newSize - 1 });
    
    // Reset states
    setGameState('PLAYING');
    setArrows(1);
    setWumpusAlive(true);
    setHasGold(false);
    setDeathMessage('');
    setScore(0);
    setGameStarted(true);
    aiStateRef.current = { visitedList: new Set(), knownSafe: new Set(), knownDanger: new Set() };
  };

  useEffect(() => {
    // We can auto-start or wait for user to click a difficulty
    initGame(6);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || gameState !== 'PLAYING') return;
    
    let direction = null;
    if (e.key === 'ArrowUp' || e.key === 'w') direction = 'UP';
    if (e.key === 'ArrowDown' || e.key === 's') direction = 'DOWN';
    if (e.key === 'ArrowLeft' || e.key === 'a') direction = 'LEFT';
    if (e.key === 'ArrowRight' || e.key === 'd') direction = 'RIGHT';

    // Shooting Mechanics (Shift + Arrow)
    if (direction && e.shiftKey) {
      if (arrows > 0) {
        setArrows(0);
        // Check if wumpus is in that direction
        let killed = false;
        let cx = playerPos.x;
        let cy = playerPos.y;
        while (isValidMove(cx, cy, size)) {
          if (direction === 'UP') cy--;
          if (direction === 'DOWN') cy++;
          if (direction === 'LEFT') cx--;
          if (direction === 'RIGHT') cx++;
          
          if (isValidMove(cx, cy, size) && board[cy][cx].wumpus) {
            killed = true;
            break;
          }
        }
        
        if (killed) {
          setWumpusAlive(false);
          setScore(s => s + 100);
          // Remove wumpus from board
          setBoard(prev => {
            const newBoard = [...prev];
            for (let y=0; y<size; y++) {
              newBoard[y] = [...newBoard[y]];
              for (let x=0; x<size; x++) {
                if (newBoard[y][x].wumpus) {
                  newBoard[y][x].wumpus = false;
                }
              }
            }
            return newBoard;
          });
          alert('You hear a terrifying scream. The Wumpus is dead!');
        } else {
          alert('Your arrow hit nothing but stone.');
        }
      }
      return;
    }

    if (direction) {
      setPlayerPos((prev) => {
        const newPos = movePlayer(prev, direction, size);
        setScore(s => s - 1); // Cost of moving
        
        // Evaluate new cell
        const cell = board[newPos.y][newPos.x];
        
        if (cell.pit) {
          setGameState('LOST');
          setDeathMessage('You fell into a bottomless pit!');
        } else if (cell.wumpus && wumpusAlive) {
          setGameState('LOST');
          setDeathMessage('The Wumpus ate you!');
        } else if (cell.gold && !hasGold) {
          setHasGold(true);
          setScore(s => s + 1000);
          // Remove gold
          setBoard((prevBoard) => {
            const b = [...prevBoard];
            b[newPos.y] = [...b[newPos.y]];
            b[newPos.y][newPos.x].gold = false;
            return b;
          });
          alert('You found the gold! Now return to the entrance (bottom-left) to escape!');
        } else if (hasGold && newPos.x === 0 && newPos.y === size - 1) {
          setGameState('WON');
          if (user) saveScore(user.username, score + 1000, `${size}x${size}`);
        }

        // Mark as visited
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[newPos.y] = [...newBoard[newPos.y]];
          newBoard[newPos.y][newPos.x] = {
            ...newBoard[newPos.y][newPos.x],
            visited: true
          };
          return newBoard;
        });
        
        return newPos;
      });
    }
  }, [gameStarted, gameState, size, arrows, playerPos, board, wumpusAlive, hasGold]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const runAIStep = () => {
    if (gameState !== 'PLAYING') return;
    
    // If has gold, just go back to start
    if (hasGold) {
      setPlayerPos({ x: 0, y: size - 1 });
      setGameState('WON');
      if (user) saveScore(user.username, score + 1000, `${size}x${size}`);
      return;
    }

    const { visitedList, knownSafe, knownDanger } = aiStateRef.current;
    const result = solveStep(board, size, playerPos, visitedList, knownSafe, knownDanger);
    
    if (result.action === 'GRAB_GOLD') {
      setHasGold(true);
      setScore(s => s + 1000);
      setBoard((prevBoard) => {
        const b = [...prevBoard];
        b[playerPos.y] = [...b[playerPos.y]];
        b[playerPos.y][playerPos.x].gold = false;
        return b;
      });
    } else if (result.action === 'MOVE') {
      const newPos = result.pos;
      setPlayerPos(newPos);
      setScore(s => s - 1);
      
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[newPos.y] = [...newBoard[newPos.y]];
        newBoard[newPos.y][newPos.x].visited = true;
        return newBoard;
      });
    } else if (result.action === 'STUCK') {
      alert('AI is stuck and cannot find a guaranteed safe move.');
    }
  };

  return (
    <div className="game-page" style={{ padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {!gameStarted ? (
        <button className="btn-primary" onClick={() => initGame(6)}>Generate Dungeon</button>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%', maxWidth: '800px' }}>
          
          <div className="hud pixel-border" style={{ display: 'flex', justifyContent: 'space-around', width: '100%', padding: '16px', backgroundColor: 'var(--color-surface)' }}>
            <div>🏹 Arrows: {arrows}</div>
            <div>💰 Gold: {hasGold ? 'Yes' : 'No'}</div>
            <div>⭐ Score: {score}</div>
          </div>

          {gameState !== 'PLAYING' && (
            <div className={`game-over-banner pixel-border ${gameState === 'WON' ? 'won' : 'lost'}`} style={{ padding: '24px', width: '100%', backgroundColor: gameState === 'WON' ? 'var(--color-success)' : 'var(--color-danger)' }}>
              <h2>{gameState === 'WON' ? 'VICTORY!' : 'GAME OVER'}</h2>
              <p>{gameState === 'LOST' ? deathMessage : 'You escaped with the gold!'}</p>
              <button className="btn-primary" style={{ marginTop: '16px', backgroundColor: '#111', color: '#fff' }} onClick={() => initGame(size)}>Play Again</button>
            </div>
          )}

          <div className="difficulty-selectors" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => initGame(4)}>Easy (4x4)</button>
            <button className="btn-primary" onClick={() => initGame(6)}>Medium (6x6)</button>
            <button className="btn-primary" onClick={() => initGame(8)}>Hard (8x8)</button>
            <button className="btn-primary" style={{ backgroundColor: 'var(--color-secondary)' }} onClick={runAIStep}>AI Step</button>
          </div>
          
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Use Arrow Keys to Move. Hold SHIFT + Arrow to Shoot.</p>

          <GameBoard board={board} size={size} playerPos={playerPos} />
        </div>
      )}
    </div>
  );
};

export default GamePage;
