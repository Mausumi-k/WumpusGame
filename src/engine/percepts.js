export const applyPercepts = (board, size) => {
  // Reset percepts
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      board[y][x].breeze = false;
      board[y][x].stench = false;
      board[y][x].glitter = false;
    }
  }

  const isValid = (x, y) => x >= 0 && x < size && y >= 0 && y < size;

  const setAdjacents = (x, y, property) => {
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }, // left
      { dx: 1, dy: 0 }   // right
    ];

    directions.forEach(({ dx, dy }) => {
      const nx = x + dx;
      const ny = y + dy;
      if (isValid(nx, ny)) {
        board[ny][nx][property] = true;
      }
    });
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = board[y][x];
      
      if (cell.pit) {
        setAdjacents(x, y, 'breeze');
      }
      
      if (cell.wumpus) {
        setAdjacents(x, y, 'stench');
      }
      
      if (cell.gold) {
        // Glitter is usually in the exact same room as the gold
        cell.glitter = true;
      }
    }
  }
};
