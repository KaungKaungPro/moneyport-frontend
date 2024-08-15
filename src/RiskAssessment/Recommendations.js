import React, { useEffect, useState } from "react";
import axios from "axios";
import RouteNav from "../components/RouteNav";
import { useParams } from "react-router-dom";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState({});
  const [error, setError] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing");
      return;
    }

    axios
        .get(`http://127.0.0.1:5082/api/predict_from_db/${userId}`)
        .then((response) => {
          setRecommendations(response.data);
        })
        .catch((error) => {
          setError(`Error fetching recommendations: ${error.message}`);
        });
  }, [userId]);

  if (error) {
    return <div className="text-red-600 font-bold text-center mt-8">{error}</div>;
  }

  if (!recommendations.risk_level || !recommendations.recommended_stocks) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  const riskLevelDescriptions = {
    R1: "Low risk tolerance (Conservative investors)",
    R2: "Medium risk tolerance (Moderate investors)",
    R3: "High risk tolerance (Aggressive investors)",
  };

  return (
      <div className="bg-gray-100 min-h-screen">
        <RouteNav />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Risk Level: {recommendations.risk_level}</h2>
            <p className="text-gray-700 mb-4">{riskLevelDescriptions[recommendations.risk_level]}</p>
            <h3 className="text-xl font-semibold mb-2">Risk Level Descriptions:</h3>
            <ul className="list-disc pl-5 mb-4">
              {Object.entries(riskLevelDescriptions).map(([level, description]) => (
                  <li key={level} className="text-gray-700">
                    <span className="font-semibold">{level}:</span> {description}
                  </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Recommended Stocks:</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Symbol</th>
                  <th className="px-4 py-2 text-left">Stock Name</th>
                  <th className="px-4 py-2 text-left">Sector</th>
                </tr>
                </thead>
                <tbody>
                {recommendations.recommended_stocks.map((stock) => (
                    <tr key={stock.stock_code} className="border-b">
                      <td className="px-4 py-2">
                        <a
                            href={`https://finance.yahoo.com/quote/${stock.stock_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {stock.stock_code}
                        </a>
                      </td>
                      <td className="px-4 py-2">{stock.stock_name}</td>
                      <td className="px-4 py-2">{stock.sector !== null ? stock.sector : "N/A"}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Recommendations;