import { applyPercepts } from './percepts';

export const createEmptyBoard = (size) => {
  const board = [];
  for (let y = 0; y < size; y++) {
    const row = [];
    for (let x = 0; x < size; x++) {
      row.push({
        id: `${x}-${y}`,
        x,
        y,
        pit: false,
        wumpus: false,
        gold: false,
        visited: false,
        breeze: false,
        stench: false,
        glitter: false
      });
    }
    board.push(row);
  }
  return board;
};

const getRandomEmptyCell = (board, size, exclude = []) => {
  let x, y;
  let attempts = 0;
  while (attempts < 100) {
    x = Math.floor(Math.random() * size);
    y = Math.floor(Math.random() * size);
    
    // Check exclusion (like start position)
    const isExcluded = exclude.some(pos => pos.x === x && pos.y === y);
    if (isExcluded) {
      attempts++;
      continue;
    }

    const cell = board[y][x];
    if (!cell.pit && !cell.wumpus && !cell.gold) {
      return cell;
    }
    attempts++;
  }
  return null;
};

export const generateBoard = (size, numPits) => {
  const board = createEmptyBoard(size);
  
  // Start position is always bottom-left (0, size-1)
  const startX = 0;
  const startY = size - 1;
  board[startY][startX].visited = true; // Player starts here, so it's visited
  
  // Safe area: starting cell and immediate neighbors
  const safeArea = [
    { x: startX, y: startY },
    { x: startX + 1, y: startY },
    { x: startX, y: startY - 1 }
  ];

  // Place Wumpus
  const wumpusCell = getRandomEmptyCell(board, size, safeArea);
  if (wumpusCell) wumpusCell.wumpus = true;

  // Place Gold
  const goldCell = getRandomEmptyCell(board, size, safeArea);
  if (goldCell) goldCell.gold = true;

  // Place Pits
  for (let i = 0; i < numPits; i++) {
    const pitCell = getRandomEmptyCell(board, size, safeArea);
    if (pitCell) pitCell.pit = true;
  }

  // Phase 4: Percepts - Calculate after placement
  applyPercepts(board, size);
  
  return board;
};
