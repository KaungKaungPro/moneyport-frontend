import React from "react";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData, options, title }) {
  return (
    <div>
      <div className="container">
        <div className="chart-container w-75 h-75 m-auto">
          <h2 style={{ textAlign: "center" }}>{title}</h2>
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default PieChart;
