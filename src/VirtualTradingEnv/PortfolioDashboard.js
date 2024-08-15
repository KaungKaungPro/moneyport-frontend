import React, { useState } from "react";
import { Link } from "react-router-dom";
import RouteTitle from "../components/RouteTitle";
import Loader from "../components/Loader";
import PieChart from "./VtComponents/PieChart";
import { useTIContext, useUserContext } from "./VTELayout";
import { getCurrentStockPrice } from "../utils/computePortfolio";

const PortfolioDashboard = () => {
  const [loading, setLoading] = useState(false);
  const { userId, portfolios } = useUserContext();
  const { mainBoard } = useTIContext();

  return (
      <div className="container mx-auto px-4 py-8">
        {loading && <Loader />}
        <RouteTitle title="My Portfolios" />
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-2/3 px-4 mb-8">
            {portfolios && portfolios.map((pf, ind) => (
                <div key={ind} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                  <h4 className="bg-gray-50 text-gray-700 font-semibold py-3 px-6">{pf.portfolioName}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Trade Date</th>
                      </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {pf.portfolioStocks.map((ps) => (
                          <tr key={ps.stockCode} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Link
                                  to={`/app/vte/viewStockTrade/${ps.stockCode}`}
                                  className="text-blue-600 hover:text-blue-900"
                              >
                                {ps.stockName}
                              </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{ps.quantity}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{ps.price}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {mainBoard && getCurrentStockPrice(ps.stockCode, mainBoard.stockData).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {mainBoard && (ps.quantity * getCurrentStockPrice(ps.stockCode, mainBoard.stockData)).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {ps.lastTradeDate.split(" ").slice(0, 3).join(" ")}
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
            ))}
          </div>
          <div className="w-full lg:w-1/3 px-4">
            {portfolios && mainBoard && portfolios.map((pf) => (
                <div key={pf.portfolioName} className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                  <h4 className="bg-gray-50 text-gray-700 font-semibold py-3 px-6">{pf.portfolioName}</h4>
                  <div className="p-6">
                    <PieChart
                        chartData={{
                          labels: [...pf.portfolioStocks.map((ps) => ps.stockName)],
                          datasets: [
                            {
                              label: "Portfolio Value",
                              data: [
                                ...pf.portfolioStocks.map(
                                    (ps) => ps.quantity * getCurrentStockPrice(ps.stockCode, mainBoard.stockData).toFixed(2)
                                ),
                              ],
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                        title={pf.portfolioName}
                    />
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
}

export default PortfolioDashboard;