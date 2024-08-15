import React, { useEffect, useState } from "react";
import $ from "jquery";
import LineChart from "./VtComponents/LineChart";
import { useParams } from "react-router-dom";
import RouteTitle from "../components/RouteTitle";
import TradeInstruction from "./VtComponents/TradeInstruction";
import { useTIContext, useUserContext } from "./VTELayout";
import {
  computeBalance,
  isInPortfolios,
  sufficientStockHolding,
} from "../utils/computePortfolio";

const StockInfoItem = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
);

const StockInfo = ({ stockInfo }) => {
  const infoItems = [
    { label: 'Open', value: stockInfo.open },
    { label: 'Market Cap', value: `$${stockInfo.marketCap}` },
    { label: 'Volume', value: stockInfo.volume },
    { label: 'Dividend', value: `${stockInfo.dividendRate}%` },
    { label: 'PE Ratio', value: stockInfo.peRatio },
    { label: 'EPS', value: stockInfo.eps },
    { label: 'Earnings Growth', value: stockInfo.earningsGrowth },
    { label: 'Revenue Growth', value: stockInfo.revenueGrowth },
    { label: 'Revenue Per Share', value: `$${stockInfo.revenuePerShare}` },
    { label: 'EBITDA', value: stockInfo.ebitda },
  ];

  return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">Stock Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item) => (
              <StockInfoItem key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>
  );
};

function ViewStockTrade(props) {
  const [stockTrades, setStockTrade] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [errorComp, setErrorComp] = useState(null);
  const [tis, setTis] = useState([]);
  const { stockCode } = useParams();
  const { userId, v$, portfolios } = useUserContext();
  const { tradeInstructions } = useTIContext();
  const [buyQuantity, setBuyQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellQuantity, setSellQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [tradeCounter, setTradeCounter] = useState(0);
  const [stock, setStock] = useState(null);
  const [stockInfo, setStockInfo] = useState({});


  useEffect(() => {
    setTis(tradeInstructions.filter((ti, i) => ti["stockCode"] === stockCode));
    function getStock1Day() {
      $.ajax({
        url: `http://localhost:8080/api/vt/viewStock1D/${
            userId ? userId : "1"
        }/${stockCode}`,
        method: "GET",
        headers: { token: JSON.parse(localStorage.getItem("user")).token },
        success: (res) => {
          if (res.length > 0) {
            setStockTrade(res.map((t) => t.price));
            setTimeLabels(res.map((t) => t.timeTraded));
            setStock(res[res.length - 1]);
            setErrorComp(null);
          } else {
            setStockTrade([]);
          }
        },
        error: (err) => {
          setErrorComp(
              <>
                <p>Stock trades did not load successfully.</p>
              </>
          );
        },
      });
    }

    while (userId === null && stockCode === null) {
      setTimeout(() => {
        console.log("waiting ...");
      }, 1000);
    }
    getStock1Day();
    $.ajax({
      url: `http://localhost:5082/api/get_ticker_info/${stockCode}`,
      method: "GET",
      success: (info) => {
        setStockInfo({
          open: info.open,
          marketCap: info.marketCap,
          volume: info.volume,
          dividendRate: info.dividendRate,
          peRatio: info.forwardPE,
          ebitda: info.ebitda,
          revenuePerShare: info.revenuePerShare,
          eps: info.forwardEps,
          earningsGrowth: info.earningsGrowth,
          revenueGrowth: info.revenueGrowth,
          previousClose: info.previousClose,
        });
      },
      error: (err) => {
        console.log(`Error retrieving ticker info ${err}`);
      },
    });
  }, [tradeInstructions, stockCode, userId]);

  function handleView(url, yMapper, labelMapper) {
    return () => {
      console.dir(stock);
      $.ajax({
        url: url,
        method: "GET",
        headers: { token: JSON.parse(localStorage.getItem("user")).token },
        success: (res) => {
          if (res.length > 0) {
            setStockTrade(res.map(yMapper));
            setTimeLabels(res.map(labelMapper));
            setErrorComp(null);
          } else {
            setStockTrade([]);
          }
        },
        error: (err) => {
          setErrorComp(
              <>
                <p>Stock trades did not load successfully.</p>
              </>
          );
        },
      });
    };
  }

  function handleBuy() {
    const buy = {
      key: tradeCounter,
      op: 1,
      tradeEnvOwner: userId,
      quantity: buyQuantity,
      price: buyingPrice,
      stockCode: stockCode,
      stockName: stock.stockName,
    };

    if (computeBalance(v$, [buy, ...tradeInstructions]) < 0) {
      alert("Cost exceeds v$ balance.");
      return;
    }
    if (window.confirm("Confirm buy?")) {
      tis.push(buy);
      tradeInstructions.push(buy);
      setTis([...tis]);
      setTradeCounter(tradeCounter + 1);
      document.getElementById("buyQuantity").value = "";
      document.getElementById("buyingPrice").value = "";
    }
  }

  function handleSell() {
    if (!isInPortfolios(stockCode, portfolios)) {
      alert("You do not hold shares in this stock to sell");
      return;
    } else if (!sufficientStockHolding(stockCode, sellQuantity, portfolios)) {
      alert("You do not hold sufficient shares of this stock to sell");
      return;
    }
    if (window.confirm("Confirm sell?")) {
      const sell = {
        key: tradeCounter,
        op: 2,
        tradeEnvOwner: userId,
        quantity: sellQuantity,
        price: sellingPrice,
        stockCode: stockCode,
        stockName: stock.stockName,
      };
      tradeInstructions.push(sell);
      tis.push(sell);
      setTis([...tis]);
      setTradeCounter(tradeCounter + 1);
      document.getElementById("sellQuantity").value = "";
      document.getElementById("sellingPrice").value = "";
    }
  }

  function handleBuy() {
    if (buyQuantity <= 0 || buyingPrice <= 0) {
      alert("Quantity and price must be greater than 0");
      return;
    }
    const buy = {
      key: tradeCounter,
      op: 1,
      tradeEnvOwner: userId,
      quantity: buyQuantity,
      price: buyingPrice,
      stockCode: stockCode,
      stockName: stock.stockName,
    };

    if (computeBalance(v$, [buy, ...tradeInstructions]) < 0) {
      alert("Cost exceeds v$ balance.");
      return;
    }
    if (window.confirm("Confirm buy?")) {
      tis.push(buy);
      tradeInstructions.push(buy);
      setTis([...tis]);
      setTradeCounter(tradeCounter + 1);
      setBuyQuantity('');
      setBuyingPrice('');
    }
  }

  function handleSell() {
    if (sellQuantity <= 0 || sellingPrice <= 0) {
      alert("Quantity and price must be greater than 0");
      return;
    }
    if (!isInPortfolios(stockCode, portfolios)) {
      alert("You do not hold shares in this stock to sell");
      return;
    } else if (!sufficientStockHolding(stockCode, sellQuantity, portfolios)) {
      alert("You do not hold sufficient shares of this stock to sell");
      return;
    }
    if (window.confirm("Confirm sell?")) {
      const sell = {
        key: tradeCounter,
        op: 2,
        tradeEnvOwner: userId,
        quantity: sellQuantity,
        price: sellingPrice,
        stockCode: stockCode,
        stockName: stock.stockName,
      };
      tradeInstructions.push(sell);
      tis.push(sell);
      setTis([...tis]);
      setTradeCounter(tradeCounter + 1);
      setSellQuantity('');
      setSellingPrice('');
    }
  }

  function removeTI(ti) {
    tis.splice(tis.indexOf(ti), 1);
    setTis([...tis]);
    const toRemove = tradeInstructions.filter((t) => t.key === ti.key)[0];
    tradeInstructions.splice(tradeInstructions.indexOf(toRemove), 1);
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <RouteTitle title="Stock Information" />
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 pr-0 lg:pr-4 mb-8 lg:mb-0">
            <div className="flex justify-between items-center mb-4">
              <div className="space-x-2">
                {["1d", "1w", "1m", "1y"].map((period) => (
                    <button
                        key={period}
                        className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                        onClick={handleView(
                            `http://localhost:8080/api/vt/viewStock${period.toUpperCase()}/${
                                userId ? userId : "1"
                            }/${stockCode}`,
                            period === "1d" ? (t) => t.price : (t) => t.close,
                            period === "1d" ? (t) => t.timeTraded : (t) => t.dateTraded
                        )}
                    >
                      {period}
                    </button>
                ))}
              </div>
              <div className="text-lg font-medium">
                <span className="mr-2">Prev. Close:</span>
                <span>{stockInfo.previousClose}</span>
              </div>
            </div>
            {stockTrades && (
                <div className="bg-white shadow-lg rounded-lg p-4">
                  <LineChart
                      chartData={{
                        labels: timeLabels,
                        datasets: [
                          {
                            label: "Price",
                            data: stockTrades,
                            tension: 0.1,
                          },
                        ],
                      }}
                      title={`Stock ${stockCode}`}
                      options={{
                        elements: {
                          point: {
                            pointStyle: false,
                          },
                          line: {
                            borderColor: "blue",
                            backgroundColor: "white",
                            borderWidth: 1.5,
                          },
                        },
                      }}
                  />
                </div>
            )}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="sticky top-4">
              <StockInfo stockInfo={stockInfo} />
              <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">Trade</h3>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium">Buy</label>
                    <input
                        type="number"
                        value={buyQuantity}
                        onChange={(e) => setBuyQuantity(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Quantity"
                        min="1"
                    />
                    <input
                        type="number"
                        value={buyingPrice}
                        onChange={(e) => setBuyingPrice(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Bid"
                        min="0.01"
                        step="0.01"
                    />
                    <button
                        type="button"
                        onClick={handleBuy}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                      Buy
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="font-medium">Sell</label>
                    <input
                        type="number"
                        value={sellQuantity}
                        onChange={(e) => setSellQuantity(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Quantity"
                        min="1"
                    />
                    <input
                        type="number"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Ask"
                        min="0.01"
                        step="0.01"
                    />
                    <button
                        type="button"
                        onClick={handleSell}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b border-gray-200">
                  Current trade instruction for {stockCode}
                </h3>
                <div className="max-h-64 overflow-y-auto">
                  {tis && tis.length > 0 ? (
                      tis.map((ti) => (
                          <TradeInstruction
                              key={ti.key}
                              ti={ti}
                              handleRemove={() => removeTI(ti)}
                          />
                      ))
                  ) : (
                      <span className="text-gray-500">No trade instructions for {stockCode}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {errorComp && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorComp}
            </div>
        )}
      </div>
  );
}

export default ViewStockTrade;