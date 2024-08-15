import React from "react";
import RouteTitle from "../components/RouteTitle";
import { useTIContext, useUserContext } from "./VTELayout";
import tradeOpText from "../utils/tradeOpText";
import { computeBalance } from "../utils/computePortfolio";

function GameDayTradeInstructions() {
  const { tradeInstructions, setTradeInstructions } = useTIContext();
  const { v$ } = useUserContext();

  function handleRemove(id) {
    const updatedInstructions = tradeInstructions.filter((_, index) => index !== id);
    setTradeInstructions(updatedInstructions);
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <RouteTitle title="Trade Instructions" />
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buy / Sell</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bid / Ask</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {tradeInstructions && tradeInstructions.length > 0 ? (
                tradeInstructions.map((ti, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tradeOpText(ti.op)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ti.stockName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ti.stockCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ti.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(ti.price).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                            onClick={() => handleRemove(index)}
                            className="text-red-600 hover:text-red-900 focus:outline-none"
                        >
                          &#x274c;
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    There is no trade instruction yet.
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
        {tradeInstructions && tradeInstructions.length > 0 && (
            <div className="mt-6 text-right">
          <span className="text-lg font-medium text-gray-700">
            Balance v$ after trade: {computeBalance(v$, tradeInstructions)}
          </span>
            </div>
        )}
      </div>
  );
}

export default GameDayTradeInstructions;