"use client"

import { useState } from 'react';
import AngleVisualizer from './angle-visualizer';

const AngleLesson: React.FC = () => {
  const [angle, setAngle] = useState(45); // Initial angle
  const [question, setQuestion] = useState('What type of angle is this?');
  const [feedback, setFeedback] = useState('');
  const [progress, setProgress] = useState(0);

  const checkAnswer = (answer: string) => {
    let correct = false;
    if (angle < 90 && answer === 'Acute') correct = true;
    if (angle === 90 && answer === 'Right') correct = true;
    if (angle > 90 && angle < 180 && answer === 'Obtuse') correct = true;
    if (angle > 180 && answer === 'Reflex') correct = true;

    if (correct) {
      setFeedback('Correct! 🎉');
      setProgress(progress + 1);
      setTimeout(() => {
        setFeedback('');
        setAngle(Math.floor(Math.random() * 360)); // Randomize angle
      }, 2000);
    } else {
      setFeedback('Incorrect. Try again! 💡');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Learn About Angles</h1>
      <AngleVisualizer angle={angle} onAngleChange={setAngle} />
      <p className="mt-4">{question}</p>
      <div className="flex gap-2 mt-2">
        {['Acute', 'Right', 'Obtuse', 'Reflex'].map((type) => (
          <button
            key={type}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => checkAnswer(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <p className="mt-2 text-lg">{feedback}</p>
      <p className="mt-4 text-sm text-gray-600">Progress: {progress} / 10</p>
    </div>
  );
};

export default AngleLesson;
