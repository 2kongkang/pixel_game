import React, { useState, useEffect } from 'react';
import { getAvatarUrl } from '../services/api';
import '../styles/pixel.css';

const GameScreen = ({ questions, onEnd }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loadingImage, setLoadingImage] = useState(true);

  const currentQuestion = questions[currentIndex];

  // Preload next image logic could be added here, but browser cache handles repeat seeds well.
  // We use the question ID or some random seed for the avatar.
  const avatarSeed = `boss_${currentQuestion.id}`;

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { id: currentQuestion.id, answer: option }];
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setLoadingImage(true);
    } else {
      onEnd(newAnswers);
    }
  };

  return (
    <div className="pixel-card">
      <div className="pixel-header" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
        <span>LVL {currentIndex + 1}/{questions.length}</span>
      </div>

      <img
        src={getAvatarUrl(avatarSeed)}
        alt="Boss"
        className="pixel-avatar"
        onLoad={() => setLoadingImage(false)}
        style={{display: 'block'}} // Override css for now if needed or keep using div
      />

      <p style={{minHeight: '60px', marginBottom: '2rem'}}>{currentQuestion.text}</p>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
        {currentQuestion.options.map((opt, idx) => (
          <button key={idx} onClick={() => handleAnswer(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameScreen;
