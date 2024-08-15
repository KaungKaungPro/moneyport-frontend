import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTIContext } from "../VTELayout";
import { getCurrentStockPrice2, parsePortfolio } from "../../utils/computePortfolio";
import confetti from 'canvas-confetti';

const GameScore = () => {
  const [gameScore, setGameScore] = useState(null);
  const [portfolios, setPortfolios] = useState([]);
  const { gameSign } = useParams();
  const { finalTradePrice } = useTIContext();

  useEffect(() => {
    const fetchGameScore = async () => {
      const [gameDateTime, userId] = gameSign.split(",");
      try {
        const response = await fetch(`http://localhost:8080/api/vt/gameScore`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'token': JSON.parse(localStorage.getItem("user")).token
          },
          body: JSON.stringify({ gameDateTime, userId }),
        });
        const data = await response.json();
        setGameScore(data.score[0].score);
        setPortfolios(parsePortfolio(data));

        // Trigger celebration effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (error) {
        console.error("Error fetching game score:", error);
      }
    };

    fetchGameScore();
  }, [gameSign]);

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">My Game Score</h1>
        {gameScore && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-green-600">
                  My score is ${Number(gameScore).toFixed(2)}
                </h2>
              </div>
              <div className="space-y-12">
                {portfolios.map((pf, index) => (
                    <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <h3 className="text-xl font-semibold bg-gray-100 p-4">{pf.portfolioName}</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full table-auto">
                          <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">Stock</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Purchase Price</th>
                            <th className="px-4 py-2 text-left">Current Price</th>
                            <th className="px-4 py-2 text-left">Value</th>
                            <th className="px-4 py-2 text-left">Last Trade Date</th>
                          </tr>
                          </thead>
                          <tbody>
                          {pf.portfolioStocks?.map((ps) => (
                              <tr key={ps.stockCode} className="border-b">
                                <td className="px-4 py-2">{ps.stockName}</td>
                                <td className="px-4 py-2">{ps.quantity}</td>
                                <td className="px-4 py-2">${ps.price}</td>
                                <td className="px-4 py-2">
                                  ${finalTradePrice && getCurrentStockPrice2(ps.stockCode, finalTradePrice).toFixed(2)}
                                </td>
                                <td className="px-4 py-2">
                                  ${finalTradePrice && (ps.quantity * getCurrentStockPrice2(ps.stockCode, finalTradePrice)).toFixed(2)}
                                </td>
                                <td className="px-4 py-2">{ps.lastTradeDate.split(" ").slice(0, 3).join(" ")}</td>
                              </tr>
                          ))}
                          </tbody>
                        </table>
                      </div>
                      {!pf.portfolioStocks && <p className="p-4 text-center text-gray-500">No trades to display</p>}
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default GameScore;