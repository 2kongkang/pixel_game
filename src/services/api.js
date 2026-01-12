import axios from 'axios';

const API_URL = import.meta.env.VITE_GOOGLE_APP_SCRIPT_URL;
const MOCK_MODE = API_URL?.includes('PLACEHOLDER') || !API_URL;

// Mock Data
const MOCK_QUESTIONS = [
  { id: 1, text: "Wait, is this a pixel?", options: ["Yes", "No", "Maybe", "It's a square"], answer: "It's a square" },
  { id: 2, text: "Can you see me?", options: ["Yes", "No", "Blurry", "Pixelated"], answer: "Pixelated" },
  { id: 3, text: "1 + 1 = ?", options: ["11", "2", "10", "Window"], answer: "2" },
  { id: 4, text: "Best retro console?", options: ["NES", "SNES", "Genesis", "Atari"], answer: "SNES" },
  { id: 5, text: "Color of the sky?", options: ["Blue", "Green", "Red", "#0000FF"], answer: "Blue" },
];

export const getQuestions = async (count = 5) => {
  if (MOCK_MODE) {
    console.log("Mock Mode: Fetching questions");
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ data: { status: 'success', data: MOCK_QUESTIONS.slice(0, count) } });
      }, 500);
    });
  }
  return axios.get(`${API_URL}?action=getQuestions&count=${count}`);
};

export const submitScore = async (data) => {
  if (MOCK_MODE) {
    console.log("Mock Mode: Submitting score", data);
    return new Promise(resolve => {
      setTimeout(() => {
        const reviewData = data.answers.map(a => {
           const question = MOCK_QUESTIONS.find(q => q.id === a.id);
           return {
             id: a.id,
             question: question ? question.text : 'Unknown',
             userAnswer: a.answer,
             correctAnswer: question ? question.answer : 'Unknown',
             isCorrect: question ? question.answer === a.answer : false
           };
        });
        const score = reviewData.filter(r => r.isCorrect).length;

        resolve({
          data: {
            status: 'success',
            result: {
              score: score,
              isPass: score >= 3, // Mock threshold
              reviewData: reviewData
            }
          }
        });
      }, 500);
    });
  }
  return axios.post(API_URL, JSON.stringify({ action: 'submitScore', ...data }), {
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
  });
};

export const getAvatarUrl = (seed) => {
  // Using DiceBear Pixel Art
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}`;
};
