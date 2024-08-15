import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import RouteNav from "../components/RouteNav";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const FLASK_API_URL = "http://localhost:5082";

const PredictionResult = ({ symbol, result, onBack }) => {
  const [sentimentData, setSentimentData] = useState({
    sentiments: [],
    model_sentiment: 0,
  });
  const [userSentiment, setUserSentiment] = useState(0);
  const [showSentiment, setShowSentiment] = useState(false);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [sentimentScore, setSentimentScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [headline, setHeadline] = useState("");
  const [newsContent, setNewsContent] = useState("");
  const [expandedNews, setExpandedNews] = useState(false);
  const [sentimentSelected, setSentimentSelected] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  const [newsSummary, setNewsSummary] = useState("");

  const fetchSentimentData = useCallback(async () => {
    if (!symbol) {
      setError(
        "Symbol is undefined. Please ensure a stock symbol is selected."
      );
      return;
    }

    try {
      const response = await axios.get(
        `${FLASK_API_URL}/api/news/sentiment/${symbol}`
      );
      console.log("Raw API response:", response.data);
      if (response.data.sentiments && response.data.sentiments.length > 0) {
        setSentimentData(response.data);
        setHeadline(response.data.sentiments[0].headline);
        setNewsContent(response.data.sentiments[0].content || "");
        setNewsSummary(response.data.sentiments[0].summary || "");
        setError(null);
      } else {
        setError("No sentiment data available for this stock.");
      }
    } catch (err) {
      console.error("Error fetching sentiment:", err);
      setError(
        `Error fetching sentiment: ${err.response?.data?.error || err.message}`
      );
      setSentimentData({ sentiments: [], model_sentiment: 0 });
    }
  }, [symbol]);

  useEffect(() => {
    fetchSentimentData();
  }, [fetchSentimentData]);

  useEffect(() => {
    if (showSentiment) {
      fetchSentimentData();
    }
  }, [fetchSentimentData, showSentiment]);

  const calculateSentimentScore = useCallback(() => {
    const modelSentiment = sentimentData.model_sentiment;
    const difference = Math.abs(userSentiment - modelSentiment);
    let score;

    const isUserNeutral = Math.abs(userSentiment) <= 0.1;
    const isModelNeutral = Math.abs(modelSentiment) <= 0.1;

    if (isUserNeutral && isModelNeutral) {
      score = 100;
    } else if (isUserNeutral || isModelNeutral) {
      score = 50;
    } else if (difference <= 0.1) {
      score = 100;
    } else if (difference <= 0.3) {
      score = 70;
    } else if (difference <= 0.5) {
      score = 40;
    } else {
      score = 10;
    }

    setSentimentScore(score);
    return score;
  }, [userSentiment, sentimentData.model_sentiment]);

  const calculateTotalScore = useCallback(() => {
    const predictionWeight = 0.7;
    const sentimentWeight = 0.3;
    const weightedPredictionScore = result.score * predictionWeight;
    const weightedSentimentScore = sentimentScore * sentimentWeight;
    const total = weightedPredictionScore + weightedSentimentScore;
    setTotalScore(Math.round(total));
  }, [result.score, sentimentScore]);

  useEffect(() => {
    if (showSentiment) {
      const score = calculateSentimentScore();
      setSentimentScore(score);
      calculateTotalScore();
      setShowInsight(true);
    } else {
      setTotalScore(result.score);
      setShowInsight(false);
    }
  }, [
    showSentiment,
    calculateSentimentScore,
    calculateTotalScore,
    result.score,
  ]);

  const getScoreComment = (score) => {
    if (score < 30) return "Keep practicing! There's room for improvement.";
    if (score < 60) return "Not bad! You're getting the hang of it.";
    if (score < 90) return "Great job! Your analysis is quite accurate.";
    return "Excellent! You've mastered this stock analysis.";
  };

  const lineChartData = {
    labels: result.modelPredictions.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Model Predictions",
        data: result.modelPredictions,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Stock Price Predictions for Next 7 Days",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Price ($)",
        },
      },
    },
  };

  const sentimentComparisonData = {
    labels: ["Model Sentiment", "User Sentiment"],
    datasets: [
      {
        label: "Sentiment Comparison",
        data: [sentimentData.model_sentiment, userSentiment],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgb(75, 192, 192)", "rgb(255, 99, 132)"],
        borderWidth: 1,
      },
    ],
  };

  const sentimentComparisonOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Model vs User Sentiment Comparison",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        min: -1,
        title: {
          display: true,
          text: "Sentiment Score",
        },
      },
    },
  };
  const getSentimentScoreExplanation = () => {
    return `
      <h4>Understanding the Sentiment Score</h4>
      <p>The sentiment score represents the degree of positivity or negativity associated with the stock based on recent news and market sentiment.</p>
      <ul>
        <li>Scores range from -1 (very negative) to 1 (very positive), with 0 being neutral.</li>
        <li>The Model Sentiment is calculated based on recent news and market data.</li>
        <li>Your Sentiment is what you input using the slider.</li>
        <li>The Sentiment Score shown above reflects how closely your sentiment matches the model's sentiment.</li>
        <li>A higher score means your sentiment analysis is more aligned with the model's analysis.</li>
        <li>This comparison helps you gauge and improve your ability to interpret market sentiment.</li>
      </ul>
      <p>By comparing your sentiment assessment to the model's, you can gain insights into how well you're interpreting market news and sentiment, which is an important skill in stock market analysis and prediction.</p>
    `;
  };
  const getAnalysisWriteup = () => {
    const modelSentiment = sentimentData.model_sentiment || 0;
    const modelSentimentFormatted = modelSentiment.toFixed(2);

    const thresholdPositive = 0.5;
    const thresholdStronglyPositive = 0.75;
    const thresholdNeutral = 0.1;

    let sentimentDescription;
    if (Math.abs(modelSentiment) <= thresholdNeutral) {
      sentimentDescription = `neutral (between -${thresholdNeutral} and ${thresholdNeutral})`;
    } else if (modelSentiment >= thresholdStronglyPositive) {
      sentimentDescription = `strongly positive (greater than ${thresholdStronglyPositive})`;
    } else if (modelSentiment >= thresholdPositive) {
      sentimentDescription = `positive (greater than ${thresholdPositive})`;
    } else if (modelSentiment > thresholdNeutral) {
      sentimentDescription = `slightly positive (between ${thresholdNeutral} and ${thresholdPositive})`;
    } else if (modelSentiment < -thresholdNeutral) {
      sentimentDescription = `negative (less than -${thresholdNeutral})`;
    }

    return `
      <h3>Stock Market Insight: ${symbol}</h3>
      <p>
        Great job on your analysis of ${symbol}! Here's what we've found:
      </p>
      <ul>
        <li><strong>Technical Analysis:</strong> The moving average model shows a ${
          result.score > 50 ? "positive" : "negative"
        } trend for ${symbol}, based on historical data and future predictions.</li>
        <li><strong>Sentiment Analysis:</strong> The model sentiment score is ${modelSentimentFormatted}, which indicates that the current market sentiment is ${sentimentDescription}. This reflects how recent news and market opinions might impact ${symbol}'s performance.</li>
      </ul>
      <p>
        Combining these insights gives a fuller picture of ${symbol}'s potential performance. Keep honing your analysis skills for better investment decisions!
      </p>
    `;
  };

  const getGeneralAnalysisWriteup = () => {
    return `
      <h3>Technical and Sentiment Analysis in Stock Prediction</h3>
      <h4>Technical Analysis</h4>
      <p>
        Technical analysis is a method used to evaluate investments and identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume. In this application, we use a moving average model, which is a common technique in technical analysis.
      </p>
      <p>
        Moving averages help smooth out price data by creating a constantly updated average price. This can help identify trends and potential support or resistance levels in the stock's price movement.
      </p>
      <h4>Sentiment Analysis</h4>
      <p>
        Sentiment analysis in the context of stock prediction involves analyzing news articles, social media posts, and other text data to gauge the overall market sentiment towards a particular stock or the market as a whole.
      </p>
      <p>
        By quantifying the sentiment in news headlines and articles related to a stock, we can gain insights into how public opinion might influence stock prices. Positive sentiment might indicate potential price increases, while negative sentiment could suggest possible declines.
      </p>
      <h4>Importance of Technical and Sentiment Analysis</h4>
      <p>
        Combining technical analysis with sentiment analysis provides a more comprehensive view of a stock's potential performance. While technical analysis helps identify trends based on historical price data, sentiment analysis incorporates the impact of current events and market opinions. Together, they offer a balanced approach to stock prediction, considering both quantitative data and qualitative factors that may influence stock prices.
      </p>
    `;
  };

  return (
      <div className="bg-gray-100 min-h-screen">
        <RouteNav />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Latest Headline for {symbol}</h2>
              {headline && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{headline}</h3>
                    <p className="text-gray-700">
                      {expandedNews ? newsContent : newsSummary}
                    </p>
                    {/*<button*/}
                    {/*    onClick={() => setExpandedNews(!expandedNews)}*/}
                    {/*    className="mt-2 text-blue-600 hover:text-blue-800"*/}
                    {/*>*/}
                    {/*  {expandedNews ? "Show Less" : "Read More"}*/}
                    {/*</button>*/}
                  </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Prediction for {symbol}</h2>
                <div className="space-y-2">
                  <p>Your Prediction: ${result.userPrediction.toFixed(2)}</p>
                  <p>Model's Prediction: ${result.modelPredictions[0].toFixed(2)}</p>
                  <p>Prediction Score: {result.score}</p>
                  {result.score === 0 && (
                      <p className="text-red-600">
                        The prediction score is zero when your prediction differs from
                        the model's prediction by more than 10%. This indicates a
                        significant discrepancy between your analysis and the model's
                        forecast.
                      </p>
                  )}
                </div>

                <button
                    onClick={() => setShowHint(!showHint)}
                    className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {showHint ? "Hide Prediction Graph" : "Show Prediction Graph"}
                </button>

                {showHint && (
                    <div className="mt-4">
                      <Line options={lineChartOptions} data={lineChartData} />
                    </div>
                )}

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2">What's your sentiment?</h3>
                  <div className="relative pt-1">
                    <input
                        type="range"
                        min="-1"
                        max="1"
                        step="0.01"
                        value={userSentiment}
                        onChange={(e) => {
                          setUserSentiment(parseFloat(e.target.value));
                          setSentimentSelected(true);
                        }}
                        className="w-full"
                    />
                    <div className="flex justify-between text-xs px-2">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                  <p className="mt-2">Your Sentiment: {userSentiment.toFixed(2)}</p>
                </div>

                {!showSentiment && (
                    <button
                        onClick={() => setShowSentiment(true)}
                        disabled={!symbol || !sentimentSelected}
                        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                      Analyze Sentiment for {symbol}
                    </button>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                {showSentiment && sentimentData.sentiments.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Sentiment Analysis for {symbol}</h3>
                      <div className="mb-6">
                        <h4 className="text-xl font-semibold mb-2">Recent Sentiment Results:</h4>
                        {sentimentData.sentiments.slice(0, 1).map((sentiment, index) => (
                            <div key={index} className="mb-2">
                              <p>Sentiment Score: {sentiment.score.toFixed(2)}</p>
                            </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold mb-2">Comparison:</h4>
                        <div className="mb-4">
                          <Bar
                              options={sentimentComparisonOptions}
                              data={sentimentComparisonData}
                          />
                        </div>
                        <p>Model Sentiment: {sentimentData.model_sentiment.toFixed(2)}</p>
                        <p>Your Sentiment: {userSentiment.toFixed(2)}</p>
                        <p>Sentiment Score: {sentimentScore}</p>
                        <p className="mt-2 font-semibold">{getScoreComment(sentimentScore)}</p>
                      </div>
                    </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-6">
                <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: getGeneralAnalysisWriteup() }}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Total Score: {totalScore}</h3>
            </div>
          </div>

          {showInsight && (
              <div className="mt-8 bg-white shadow-lg rounded-lg overflow-hidden">
                <div
                    className="p-6 prose"
                    dangerouslySetInnerHTML={{ __html: getAnalysisWriteup() }}
                />
              </div>
          )}

          <button
              onClick={onBack}
              className="mt-8 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Stock Prediction
          </button>

          {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
      </div>
  );
};


export default PredictionResult;
