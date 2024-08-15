import React, { useState } from 'react';

const UserPredictionInput = ({ onSubmitPrediction }) => {
  const [prediction, setPrediction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitPrediction(Number(prediction));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={prediction}
        onChange={(e) => setPrediction(e.target.value)}
        placeholder="Enter your predicted value"
      />
      <button type="submit">Submit Prediction</button>
    </form>
  );
};

export default UserPredictionInput;