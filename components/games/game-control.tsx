import React, { useState } from 'react';

type GameControlsProps = {
  onSubmit: (answer: number) => void;
  dimensions: number[];
  property: 'Area' | 'Volume';
};

const GameControls: React.FC<GameControlsProps> = ({ onSubmit, property }) => {
  const [answer, setAnswer] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAnswer = parseFloat(answer);
    if (!isNaN(numericAnswer)) {
      onSubmit(numericAnswer);
      setAnswer('');
    }
  };

  return (
    <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
      <label className="text-lg">
        Enter the {property}:
        <input
          type="number"
          step="0.01"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1 ml-2"
        />
      </label>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
};

export default GameControls;
