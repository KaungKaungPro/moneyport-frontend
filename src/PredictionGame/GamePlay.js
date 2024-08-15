
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GamePlay = ({ symbol, userPrediction, modelPrediction, predictedDate, onFinish }) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [simulatedPrices, setSimulatedPrices] = useState([]);

  useEffect(() => {
    // Simulate a week of prices around the model prediction
    const volatility = 0.02; // 2% daily volatility
    const simulated = Array(7).fill(modelPrediction).map((price, index) => {
      const dayOffset = index - 3; // Center on the predicted day
      const trendFactor = 1 + (dayOffset * 0.005); // Slight trend
      const randomFactor = 1 + (Math.random() - 0.5) * volatility;
      return price * trendFactor * randomFactor;
    });
    setSimulatedPrices(simulated);
  }, [modelPrediction]);

  const chartData = {
    labels: ['3 Days Before', '2 Days Before', '1 Day Before', 'Predicted Day', '1 Day After', '2 Days After', '3 Days After'],
    datasets: [
      {
        label: 'Simulated Stock Price',
        data: simulatedPrices.slice(0, currentDay + 1),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Your Prediction',
        data: Array(7).fill(userPrediction),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
      },
      {
        label: 'Model Prediction',
        data: Array(7).fill(modelPrediction),
        borderColor: 'rgb(54, 162, 235)',
        borderDash: [10, 5],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} Stock Price Around ${predictedDate}`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const nextDay = () => {
    if (currentDay < 6) {
      setCurrentDay(currentDay + 1);
    }
  };

  const calculateScore = () => {
    const predictedDayPrice = simulatedPrices[3]; // Index 3 is the predicted day
    const errorPercentage = Math.abs(userPrediction - predictedDayPrice) / predictedDayPrice;
    if (errorPercentage > 0.1) return 0;
    return Math.max(0, 100 - Math.floor(-200 * Math.log10(1 - errorPercentage)));
  };

  if (simulatedPrices.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Stock Price Movement Around {predictedDate}</h2>
      <div style={{ width: '80%', margin: 'auto' }}>
        <Line options={chartOptions} data={chartData} />
      </div>
      <p>Day: {currentDay + 1}</p>
      <p>Current Price: ${simulatedPrices[currentDay].toFixed(2)}</p>
      <p>Your Prediction: ${userPrediction.toFixed(2)}</p>
      
      {currentDay < 6 ? (
        <button onClick={nextDay}>Next Day</button>
      ) : (
        <div>
          <p>Final Score: {calculateScore()}</p>
          <button onClick={() => onFinish(calculateScore())}>Finish Game</button>
        </div>
      )}

      <button onClick={() => setShowHint(!showHint)}>
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>
      {showHint && (
        <div>
          <h3>Model Prediction:</h3>
          <p>Predicted Price for {predictedDate}: ${modelPrediction.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default GamePlay;