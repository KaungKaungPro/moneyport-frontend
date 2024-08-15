function parsePortfolio(res) {
  if (!res.portfolioCount) {
    console.log("Null response from server");
    return null;
  }
  let portfolioCount = res.portfolioCount[0].pfc;
  let portfoliosData = [];
  for (let j = 0; j < portfolioCount; j++) {
    let pf = {
      portfolioName: res.portfolios[j].name,
      portfolioStocks: [],
    };
    for (let i = 0; i < res.portfolios[j].stockCount; i++) {
      let sc = res.portfolios[j][`ps${i}StockCode`];
      let sn = res.portfolios[j][`ps${i}StockName`];
      let qty = res.portfolios[j][`ps${i}Quantity`];
      let pp = res.portfolios[j][`ps${i}PurchasedPrice`];
      let ltd = res.portfolios[j][`ps${i}LastTradeDate`];
      pf.portfolioStocks.push({
        stockCode: sc,
        stockName: sn,
        quantity: qty,
        price: pp,
        lastTradeDate: ltd,
      });
    }
    portfoliosData.push(pf);
  }
  return portfoliosData;
}

function parseVDollar(res) {
  if (!res.v$) {
    console.log("Null response from server");
    return null;
  }
  return res.v$[0].amount;
}

function parseGameDay(res) {
  if (!res.gameDay) {
    console.log("Null response from server");
    return null;
  }
  return res.gameDay[0].gameDay;
}

function computeBalance(v$, tis) {
  let balanceV$ = Number(v$);
  for (var ti of tis) {
    if (ti.op === 1) {
      balanceV$ -= Number(ti.quantity) * Number(ti.price);
    } else if (ti.op === 2) {
      balanceV$ += Number(ti.quantity) * Number(ti.price);
    }
  }
  return balanceV$.toFixed(2);
}

function isInPortfolios(stockCode, pfs) {
  for (var pf of pfs) {
    for (var ps of pf.portfolioStocks) {
      if (stockCode === ps.stockCode) {
        return true;
      }
    }
  }
  return false;
}

function sufficientStockHolding(stockCode, quantity, pfs) {
  let shareholding = 0;
  for (var pf of pfs) {
    for (var ps of pf.portfolioStocks) {
      if (stockCode === ps.stockCode) {
        shareholding = shareholding + Number(ps.quantity);
        if (shareholding >= quantity) {
          return true;
        }
      }
    }
  }
  return false;
}

function totalValue(portfolios, v$, stocks) {
  if (!portfolios || !v$ || !stocks) {
    console.log(`Null data`);
    return null;
  }
  let val = Number(v$);
  for (var pf of portfolios) {
    for (var ps of pf.portfolioStocks) {
      let sc = ps.stockCode;
      if (stocks.filter((s) => s.stockCode === sc)[0]) {
        let psCurrentValue = Number(
          stocks.filter((s) => s.stockCode === sc)[0].lastTradePrice
        );

        val += Number(ps.quantity) * psCurrentValue;
        console.log(
          `computing stock value ... ${Number(ps.quantity) * psCurrentValue}`
        );
      } else {
      }
    }
  }
  return val;
}

function getCurrentStockPrice(stockCode, stocks) {
  let stock = stocks.filter((s) => s.stockCode === stockCode)[0];
  return Number(stock.lastTradePrice);
}

function getCurrentStockPrice2(stockCode, stocks) {
  let lastTradePrice = stocks[stockCode];
  return Number(lastTradePrice);
}

export {
  parsePortfolio,
  parseVDollar,
  parseGameDay,
  sufficientStockHolding,
  computeBalance,
  isInPortfolios,
  totalValue,
  getCurrentStockPrice,
  getCurrentStockPrice2,
};
