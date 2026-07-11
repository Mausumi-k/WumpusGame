import { isValidMove } from './movement';

export const solveStep = (board, size, playerPos, visitedList, knownSafe, knownDanger) => {
  // 1. Mark current position as safe and visited
  const currentKey = `${playerPos.x},${playerPos.y}`;
  visitedList.add(currentKey);
  knownSafe.add(currentKey);

  const currentCell = board[playerPos.y][playerPos.x];

  // If gold is here, don't move, we are done
  if (currentCell.gold) {
    return { action: 'GRAB_GOLD' };
  }
  
  const getNeighbors = (x, y) => {
    const n = [];
    if (isValidMove(x, y - 1, size)) n.push({ x, y: y - 1, key: `${x},${y - 1}` });
    if (isValidMove(x, y + 1, size)) n.push({ x, y: y + 1, key: `${x},${y + 1}` });
    if (isValidMove(x - 1, y, size)) n.push({ x: x - 1, y, key: `${x - 1},${y}` });
    if (isValidMove(x + 1, y, size)) n.push({ x: x + 1, y, key: `${x + 1},${y}` });
    return n;
  };

  const neighbors = getNeighbors(playerPos.x, playerPos.y);

  // If there's no breeze and no stench, all adjacent squares are safe
  if (!currentCell.breeze && !currentCell.stench) {
    neighbors.forEach(n => {
      if (!knownDanger.has(n.key)) knownSafe.add(n.key);
    });
  } else {
    // Basic propositional logic:
    // This is a naive AI that avoids unvisited neighbors if there's danger, 
    // unless they are known to be safe from another path.
    neighbors.forEach(n => {
      if (!knownSafe.has(n.key)) {
        // We can't guarantee safety, mark as potential danger
        knownDanger.add(n.key);
      }
    });
  }

  // Choose next move: 
  // 1. Prefer unvisited safe cells adjacent to current position
  const safeUnvisitedNeighbors = neighbors.filter(n => knownSafe.has(n.key) && !visitedList.has(n.key));
  if (safeUnvisitedNeighbors.length > 0) {
    return { action: 'MOVE', pos: safeUnvisitedNeighbors[0] };
  }

  // 2. If no adjacent unvisited safe cells, backtrack to ANY known safe unvisited cell
  // In a real Wumpus AI, this requires pathfinding (A* or BFS) to that cell.
  // For simplicity, we just teleport or find a path. We will return the target cell 
  // and let the GamePage handle pathing or we just return the next step towards it.
  
  // Find all known safe cells that have not been visited
  const allSafeUnvisited = Array.from(knownSafe).filter(key => !visitedList.has(key));
  if (allSafeUnvisited.length > 0) {
    // Pick the first one and find next step (using a dummy direct return for now)
    const targetKey = allSafeUnvisited[0];
    const [tx, ty] = targetKey.split(',').map(Number);
    // Return teleport for MVP AI, or a real game would do A* pathfinding
    return { action: 'MOVE', pos: { x: tx, y: ty, key: targetKey } };
  }

  // 3. If stuck (no known safe cells), shoot an arrow randomly or guess a danger cell
  // For safety, just halt.
  return { action: 'STUCK' };
};
