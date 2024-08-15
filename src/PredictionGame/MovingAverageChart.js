import React from 'react';
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

const MovingAverageChart = ({ data, width, height }) => {
  if (!data || !data.dates || !data.prices) {
    return <div>No data available for chart</div>;
  }

  // Limit the data to the last 30 points for a more compact view
  const limitedDates = data.dates.slice(-30);
  const limitedPrices = data.prices.slice(-30);

  // Create day labels for the X-axis
  const dayLabels = limitedDates.map((_, index) => `Day ${index + 1}`);

  const chartData = {
    labels: dayLabels, // Use day labels instead of actual dates
    datasets: [
      {
        label: 'Stock Price',
        data: limitedPrices,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        pointRadius: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Stock Price Chart',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div style={{ width: width, height: height }}>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default MovingAverageChart;
