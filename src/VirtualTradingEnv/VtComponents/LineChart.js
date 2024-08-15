import React from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";


function LineChart({ chartData, title, options }) {
  
  return (
    <div className="container">
      <div className="chart-container">
        <h2 style={{ textAlign: "center" }}>{title}</h2>
        <Line data={chartData} options={ options} />
      </div>
    </div>
    
  );
}
export default LineChart;