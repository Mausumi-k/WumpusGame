export const saveScore = (username, score, difficulty) => {
  const leaderboard = JSON.parse(localStorage.getItem('wumpus_leaderboard') || '[]');
  
  leaderboard.push({
    username,
    score,
    difficulty,
    date: new Date().toISOString()
  });
  
  leaderboard.sort((a, b) => b.score - a.score);
  
  localStorage.setItem('wumpus_leaderboard', JSON.stringify(leaderboard.slice(0, 10))); // Top 10
};

export const getLeaderboard = () => {
  return JSON.parse(localStorage.getItem('wumpus_leaderboard') || '[]');
};
