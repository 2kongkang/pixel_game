import React from 'react';
import '../styles/pixel.css';

const ResultScreen = ({ score, isPass, onRestart, onReview, total }) => {
  return (
    <div className="pixel-card">
      <h1 className="pixel-title" style={{color: isPass ? 'var(--pixel-pass)' : 'var(--pixel-fail)'}}>
        {isPass ? '過關!' : '你好爛!'}
      </h1>

      <div className="pixel-avatar" style={{
        backgroundImage: isPass
          ? 'url(https://api.dicebear.com/9.x/pixel-art/svg?seed=happy_winner)'
          : 'url(https://api.dicebear.com/9.x/pixel-art/svg?seed=sad_loser)',
        backgroundSize: 'cover'
      }}></div>

      <p style={{fontSize: '1.5rem', margin: '2rem 0'}}>
        分數: {score} / {total}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button onClick={onRestart}>再來一次</button>
        <button onClick={onReview} style={{ backgroundColor: '#555' }}>查看答案</button>
      </div>
    </div>
  );
};

export default ResultScreen;
