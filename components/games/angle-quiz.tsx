import { useState } from 'react';

const Quiz = () => {
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    if (answer === '90') {
      setFeedback('Correct! 🎉 A 90° angle is a right angle.');
    } else {
      setFeedback('Incorrect. Hint: A right angle is exactly 90°.');
    }
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow w-full max-w-md">
      <h3 className="text-lg font-semibold mb-2">Quick Quiz</h3>
      <p className="mb-2">What is the angle of a right angle?</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border border-gray-400 rounded px-2 py-1 mr-2 w-full"
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded w-full"
      >
        Submit
      </button>
      {feedback && <p className="mt-2 text-center">{feedback}</p>}
    </div>
  );
};

export default Quiz;
