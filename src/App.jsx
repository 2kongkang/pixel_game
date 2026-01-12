import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import ReviewScreen from './components/ReviewScreen';
import { getQuestions, submitScore } from './services/api';
import './styles/pixel.css';

function App() {
  const [gameState, setGameState] = useState('START'); // START, PLAYING, LOADING, RESULT, REVIEW
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [scoreData, setScoreData] = useState({ score: 0, isPass: false, total: 0, reviewData: [] });
  const [error, setError] = useState('');

  const handleStart = async (id) => {
    setUserId(id);
    setGameState('LOADING');
    try {
      const response = await getQuestions(import.meta.env.VITE_QUESTION_COUNT || 5);
      if (response.data.status === 'success') {
        setQuestions(response.data.data);
        setGameState('PLAYING');
      } else {
        setError('Failed to load questions. System Error.');
        setGameState('START');
      }
    } catch (e) {
      console.error(e);
      setError('Connection Error. Check connection / GAS URL.');
      setGameState('START');
    }
  };

  const handleGameEnd = async (answers) => {
    setGameState('LOADING');
    try {
      const response = await submitScore({ userId, answers });
      if (response.data.status === 'success') {
        const { score, isPass, reviewData } = response.data.result;
        setScoreData({ score, isPass, total: questions.length, reviewData });
        setGameState('RESULT');
      } else {
        setError('Failed to submit score.');
      }
    } catch (e) {
      setError('Connection error on submit.');
    }
  };

  const handleRestart = () => {
    setGameState('START');
    setQuestions([]);
    setError('');
  };

  const handleReview = () => {
    setGameState('REVIEW');
  };

  return (
    <div className="app-container">
      {error && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          background: 'var(--pixel-fail)',
          color: 'white',
          textAlign: 'center',
          padding: '0.5rem'
        }}>
          ! ERROR: {error} !
        </div>
      )}

      {gameState === 'START' && <StartScreen onStart={handleStart} />}

      {gameState === 'LOADING' && (
        <div className="pixel-card">
          <h2 className="pixel-title">LOADING...</h2>
          <div className="pixel-avatar" style={{backgroundImage: 'url(https://api.dicebear.com/9.x/pixel-art/svg?seed=loading)', backgroundSize: 'cover'}}></div>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <GameScreen questions={questions} onEnd={handleGameEnd} />
      )}

      {gameState === 'RESULT' && (
        <ResultScreen
          score={scoreData.score}
          isPass={scoreData.isPass}
          total={scoreData.total}
          onRestart={handleRestart}
          onReview={handleReview}
        />
      )}

      {gameState === 'REVIEW' && (
        <ReviewScreen
          reviewData={scoreData.reviewData}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
