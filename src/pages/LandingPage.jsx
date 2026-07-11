import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import { getLeaderboard } from '../utils/storage';

const LandingPage = ({ onPlay }) => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  return (
    <div className="landing-page" style={{ paddingBottom: '64px' }}>
      <Hero onPlay={onPlay} />
      
      {leaderboard.length > 0 && (
        <div className="leaderboard-section pixel-border" style={{ maxWidth: '600px', margin: '0 auto', padding: '24px', backgroundColor: 'var(--color-surface)' }}>
          <h2 style={{ textAlign: 'center', color: 'var(--color-primary)', marginBottom: '16px' }}>Top Adventurers</h2>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Depth</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)', height: '40px' }}>
                  <td>#{idx + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.score}</td>
                  <td>{entry.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
