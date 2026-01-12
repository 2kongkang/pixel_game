import React from 'react';
import '../styles/pixel.css';

const ReviewScreen = ({ reviewData, onRestart }) => {
  return (
    <div className="pixel-card" style={{ maxWidth: '800px', textAlign: 'left' }}>
      <h1 className="pixel-title" style={{ textAlign: 'center', marginBottom: '1rem' }}>REVIEW</h1>

      <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '1rem' }}>
        {reviewData.map((item, index) => (
          <div key={index} style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            border: `2px solid ${item.isCorrect ? 'var(--pixel-pass)' : 'var(--pixel-fail)'}`,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '10px',
              background: item.isCorrect ? 'var(--pixel-pass)' : 'var(--pixel-fail)',
              color: 'white',
              padding: '0 5px',
              fontSize: '0.8rem'
            }}>
              {item.isCorrect ? 'CORRECT' : 'WRONG'}
            </div>

            <p style={{ marginBottom: '0.5rem', lineHeight: '1.4' }}><strong>Q{index + 1}:</strong> {item.question}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
              <div style={{ color: item.isCorrect ? 'var(--pixel-pass)' : 'var(--pixel-text)' }}>
                你的答案: {item.userAnswer}
              </div>
              {!item.isCorrect && (
                <div style={{ color: 'var(--pixel-accent)' }}>
                  正確答案: {item.correctAnswer}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button onClick={onRestart}>回到主選單</button>
      </div>
    </div>
  );
};

export default ReviewScreen;
