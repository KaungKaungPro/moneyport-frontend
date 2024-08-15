import React from "react";
import { Link } from "react-router-dom";
import RouteTitle from "../components/RouteTitle";
import { useTIContext } from "./VTELayout";

const StockTable = ({ title, data, columns }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
                <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column}
                </th>
            ))}
          </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {data.map((sd) => (
              <tr key={sd.stockCode} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-900">
                  <Link to={`/app/vte/viewStockTrade/${sd.stockCode}`}>
                    {sd.stockCode}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sd.stockName}</td>
                {columns.slice(2).map((column) => (
                    <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Number(sd[column.toLowerCase()]).toFixed(column === 'Volume' ? 0 : 2)}
                    </td>
                ))}
              </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
);

function TradeDashboard() {
  const { mainBoard } = useTIContext();

  const tables = [
    {
      title: "Top 5 Gainers",
      data: mainBoard?.top5Gainers || [],
      columns: ["Stock Code", "Stock Name", "Open", "Close", "Prev. Close", "Gain"],
    },
    {
      title: "Top 5 Volume",
      data: mainBoard?.top5Volume || [],
      columns: ["Stock Code", "Stock Name", "Open", "Close", "Volume", "Last Trade Price"],
    },
    {
      title: "Bottom 5 Volume",
      data: mainBoard?.bottom5Volume || [],
      columns: ["Stock Code", "Stock Name", "Open", "Close", "Volume", "Last Trade Price"],
    },
    {
      title: "Top 5 Loss",
      data: mainBoard?.top5Loss || [],
      columns: ["Stock Code", "Stock Name", "Open", "Close", "Prev. Close", "Loss"],
    },
  ];

  return (
      <div className="container mx-auto px-4 py-8">
        <RouteTitle title="Virtual Trade - Mainboard" />
        <div className="flex flex-wrap -mx-4">
          <div className="w-full lg:w-1/2 px-4">
            {tables.map((table) => (
                <StockTable key={table.title} {...table} />
            ))}
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <h2 className="text-xl font-semibold mb-4">All Stocks</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  {["Stock Code", "Stock Name", "Open", "Close", "High", "Low"].map((column) => (
                      <th key={column} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column}
                      </th>
                  ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {mainBoard?.stockData?.map((sd) => (
                    <tr key={sd.stockCode} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-900">
                        <Link to={`/app/vte/viewStockTrade/${sd.stockCode}`}>
                          {sd.stockCode}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sd.stockName}</td>
                      {["open", "close", "high", "low"].map((field) => (
                          <td key={field} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {Number(sd[field]).toFixed(2)}
                          </td>
                      ))}
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
  );
}

export default TradeDashboard;