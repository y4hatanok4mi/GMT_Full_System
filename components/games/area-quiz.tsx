import { useState } from 'react';

const Quiz = () => {
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    if (answer === '2500') {
      setFeedback('Correct! 🎉 Great job!');
    } else {
      setFeedback('Incorrect. Hint: Area = Width × Height.');
    }
  };

  return (
    <div className="mt-8 bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Quick Quiz</h3>
      <p className="mb-2">If a rectangle has a width of 50 units and a height of 50 units, what is its area?</p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border border-gray-400 rounded px-2 py-1 mr-2"
      />
      <button onClick={handleSubmit} className="px-4 py-2 bg-green-500 text-white rounded">
        Submit
      </button>
      {feedback && <p className="mt-2">{feedback}</p>}
    </div>
  );
};

export default Quiz;
