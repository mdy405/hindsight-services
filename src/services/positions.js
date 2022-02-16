import pkg from "wstrade-api";
const { auth, accounts, data, quotes } = pkg;

export async function positions(event, accountType = "personal") {
  try {
    let openAccs = await accounts.all();
    // Deposits that Jane has made to her WealhSimple Trade account
    let deposits = await accounts.deposits();
    let personalPositions = await accounts.positions(openAccs[accountType]);
    let rates = await data.exchangeRates();

    return { data: personalPositions, deposits: deposits, rates: rates };
  } catch (error) {
    console.log(error);
  }
}

//set limit to negative value to have full result
export const getHistory = async (stock, period = "1d", limit = 10) => {
  try {
    let stockHistory = await quotes.history(stock, period);
    let stockData = await data.getSecurity(stock, true);
    if (limit < 0) {
      stockHistory.results = stockHistory.results.map((el) => ({
        ...el,
        open: stockData.quote.open,
        high: stockData.quote.high,
        low: stockData.quote.low,
      }));
      return stockHistory.results;
    } else {
      let l = stockHistory.results.length;
      let limitedStockHistory = stockHistory.results.slice(-4);
      limitedStockHistory = limitedStockHistory.map((limitStock) => ({
        ...limitStock,
        open: stockData.quote.open,
      }));

      return limitedStockHistory;
    }
  } catch (error) {
    console.log(error);
  }
};
