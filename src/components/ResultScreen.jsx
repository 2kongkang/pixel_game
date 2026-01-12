import React from 'react';
import '../styles/pixel.css';

const ResultScreen = ({ score, isPass, onRestart, total }) => {
  return (
    <div className="pixel-card">
      <h1 className="pixel-title" style={{color: isPass ? 'var(--pixel-pass)' : 'var(--pixel-fail)'}}>
        {isPass ? 'YOU WIN!' : 'GAME OVER'}
      </h1>

      <div className="pixel-avatar" style={{
        backgroundImage: isPass
          ? 'url(https://api.dicebear.com/9.x/pixel-art/svg?seed=happy_winner)'
          : 'url(https://api.dicebear.com/9.x/pixel-art/svg?seed=sad_loser)',
        backgroundSize: 'cover'
      }}></div>

      <p style={{fontSize: '1.5rem', margin: '2rem 0'}}>
        SCORE: {score} / {total}
      </p>

      <button onClick={onRestart}>TRY AGAIN</button>
    </div>
  );
};

export default ResultScreen;
