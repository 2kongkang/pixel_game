import React, { useState } from 'react';
import '../styles/pixel.css';

const StartScreen = ({ onStart }) => {
  const [id, setId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id.trim()) {
      onStart(id);
    }
  };

  return (
    <div className="pixel-card">
      <h1 className="pixel-title">PIXEL QUIZ</h1>
      <div className="pixel-avatar" style={{backgroundImage: 'url(https://api.dicebear.com/9.x/pixel-art/svg?seed=game_logo)', backgroundSize: 'cover'}}></div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ENTER ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          autoFocus
        />
        <button type="submit">INSERT COIN (START)</button>
      </form>
    </div>
  );
};

export default StartScreen;
