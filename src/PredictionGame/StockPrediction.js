import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import MovingAverageChart from "./MovingAverageChart";
import PredictionResult from "./PredictionResult";
import GameInstructions from "./GameInstructions";
import NewsList from "./NewsList";
import "./StockPrediction.css";
import request from "../utils/request";
import RouteNav from "../components/RouteNav";

const FLASK_API_URL = "http://localhost:5082";
const SPRING_API_URL = "http://localhost:8080";

function StockPrediction() {
  const [symbol, setSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [futureDates, setFutureDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [userPrediction, setUserPrediction] = useState("");
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showPredictionResult, setShowPredictionResult] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${FLASK_API_URL}/api/stocks`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError("Error fetching stocks. Please try again.");
    }
  };

  const fetchStockData = useCallback(async (stockSymbol) => {
    const symbolToFetch = stockSymbol || symbol;
    if (symbolToFetch.trim().length < 1) {
      setError("Please enter a valid stock symbol.");
      return;
    }
    try {
      const response = await request.get(`/stock/${symbolToFetch.toUpperCase()}`);
      console.log("Received stock data");
      console.dir(response);
      setStockData(response);
      if (response.futureDates && response.futureDates.length > 0) {
        setFutureDates(response.futureDates);
        setSelectedDate(response.futureDates[0]);
      } else {
        setFutureDates([]);
        setSelectedDate("");
      }
      setError(null);
    } catch (err) {
      setError(
          `Error fetching stock data: ${
              err.response?.data?.error || "Please try again."
          }`
      );
      setStockData(null);
      setFutureDates([]);
      setSelectedDate("");
    }
  }, [symbol]);

  const handleStockClick = useCallback((clickedSymbol) => {
    setSymbol(clickedSymbol);
    fetchStockData(clickedSymbol);
  }, [fetchStockData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol || !selectedDate || !userPrediction) {
      setError(
          "Please enter a stock symbol, select a date, and enter your prediction."
      );
      return;
    }
    const predictionData = {
      symbol: symbol.toUpperCase(),
      date: selectedDate,
      userPrediction: parseFloat(userPrediction),
    };
    try {
      const response = await request.post(`/predict`, predictionData);
      setPredictionResult(response);
      setTotalScore((prevScore) => prevScore + response.score);
      setShowPredictionResult(true);
      setError(null);
    } catch (err) {
      setError(
          `Error submitting prediction: ${
              err.response?.data?.error || err.message
          }`
      );
      setPredictionResult(null);
    }
  };

  const handleBack = () => {
    setShowPredictionResult(false);
    setUserPrediction("");
  };

  if (showPredictionResult) {
    console.log("Rendering PredictionResult with symbol:", symbol);
    return (
        <PredictionResult
            result={predictionResult}
            onBack={handleBack}
            symbol={symbol}
        />
    );
  }

  return (
      <div className="bg-gray-50 min-h-screen">
        <RouteNav />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Stock Prediction Game</h1>
            <div className="text-xl font-semibold text-blue-700">Total Score: {totalScore}</div>
          </header>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/4">
              <div className="bg-white shadow-md rounded-lg p-4 mb-4 overflow-hidden" style={{ height: '400px' }}>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Stock List</h3>
                <div className="overflow-y-auto" style={{ height: 'calc(100% - 2rem)' }}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {stocks.map((stocks) => (
                        <tr key={stocks.symbol} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            <button
                                onClick={() => handleStockClick(stocks.symbol)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                              {stocks.symbol}
                            </button>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{stocks.name}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{stocks.sector}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{stocks.risk_level}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
              >
                {showInstructions ? "Hide Game Instructions" : "Show Game Instructions"}
              </button>
              {showInstructions && <GameInstructions />}
            </div>

            <div className="lg:w-1/2">
              <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <div className="flex mb-3">
                  <input
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      placeholder="Enter stock symbol"
                      className="flex-grow mr-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  />
                  <button
                      onClick={() => fetchStockData()}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
                  >
                    Fetch Stock Data
                  </button>
                </div>

                {stockData && (
                    <div className="mb-4">
                      <MovingAverageChart
                          data={stockData}
                          width="100%"
                          height={250}
                      />
                    </div>
                )}

                {stockData && (
                    <div>
                      <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full mb-3 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      >
                        <option value="">Select a day</option>
                        {futureDates.map((date, index) => (
                            <option key={index} value={date}>
                              Day {index + 1}
                            </option>
                        ))}
                      </select>
                      <form onSubmit={handleSubmit} className="flex">
                        <input
                            type="number"
                            value={userPrediction}
                            onChange={(e) => setUserPrediction(e.target.value)}
                            placeholder="Enter your prediction"
                            required
                            className="flex-grow mr-2 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        />
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-300 ease-in-out"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                )}

                {error && <p className="text-red-600 mt-3 text-sm font-semibold">{error}</p>}
              </div>
            </div>

            <div className="lg:w-1/4">
              <div className="bg-white shadow-md rounded-lg p-4 overflow-hidden" style={{ height: '400px' }}>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Latest News</h3>
                <div className="overflow-y-auto" style={{ height: 'calc(100% - 2rem)' }}>
                  <NewsList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default StockPrediction;