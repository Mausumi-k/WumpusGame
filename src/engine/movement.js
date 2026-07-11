export const isValidMove = (x, y, size) => {
  return x >= 0 && x < size && y >= 0 && y < size;
};

export const movePlayer = (currentPos, direction, size) => {
  const newPos = { ...currentPos };

  switch (direction) {
    case 'UP':
      newPos.y -= 1;
      break;
    case 'DOWN':
      newPos.y += 1;
      break;
    case 'LEFT':
      newPos.x -= 1;
      break;
    case 'RIGHT':
      newPos.x += 1;
      break;
    default:
      break;
  }

  if (isValidMove(newPos.x, newPos.y, size)) {
    return newPos;
  }
  return currentPos; // Return original if invalid
};
