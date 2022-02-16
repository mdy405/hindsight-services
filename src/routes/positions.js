import e, { Router } from "express";
import { positions } from "../services/positions.js";
import { createStock, getStocksData } from "../services/db.js";
//import { stock } from "../models/stock.js";
const router = Router();

const wsTodbStock = (e) => {
  let change_percent =
    ((e.quantity * parseFloat(e.quote.low) - parseFloat(e.quote.open)) /
      parseFloat(e.quote.open)) *
    100;

  let change =
    (parseFloat(e.quote.low) - parseFloat(e.quote.open)) * e.quantity;

  let totalChangePer =
    ((e.quantity * parseFloat(e.quote.amount) - e.market_book_value.amount) /
      e.market_book_value.amount) *
    100;

  let totalChange =
    e.quantity * parseFloat(e.quote.amount) - e.market_book_value.amount;

  let stock = {
    symbol: e.stock.symbol,
    companyName: e.stock.name,
    marketName: e.stock.primary_exchange,
    sector: "",
    currency: e.currency,
    change: change,
    changePercent: change_percent,
    totalChange: totalChange,
    totalChangePercent: totalChangePer,
    open: parseFloat(e.quote.open),
    close: parseFloat(e.quote.previous_close),
    latestPrice: parseFloat(e.quote.amount),
    latestVolume: e.quote.volume,
    quantity: e.quantity,
    avgCost: e.market_book_value.amount,
    /*marketCap: { type: DataTypes.BIGINT, field: "marketcap" },
        peRatio: { type: DataTypes.DECIMAL, field: "pe_ratio" },
        week52High: { type: DataTypes.DECIMAL, field: "week52high" },
        week52Low: { type: DataTypes.DECIMAL, field: "week52low" },
        ytdChange: { type: DataTypes.DECIMAL, field: "ytdchange" },*/
    lastSignal: "BUY",
  };

  return stock;
};

const bStockTows = (e) => {
  let stock = {
    symbol: e.symbol,
    name: e.companyName,
    //marketName,
    //sector: e.sector,
    currency: e.currency,
    /*change,
    changePercent,*/
    variation: e.totalChange,
    variationPercent: e.totalChangePercent,
    value: e.latestPrice,
    quantity: e.quantity,
    currency: e.currency,
    avgCost: e.avgCost,
  };
  return stock;
};

router.post("/", async function (req, res) {
  try {
    const postData = req.body;

    let stocks = await getStocksData();

    let insertData = false;

    if (stocks.length <= 0) {
      /*res.status(200).send({ data: stocks });
      return;*/
      insertData = true;
    }

    let response = await positions(postData);

    let mapdata = response.data.map((e) => {
      let stock = wsTodbStock(e);

      if (insertData) {
        createStock(stock).catch((err) => console.log(err));
      }
      return bStockTows(stock);
    });

    response.data = mapdata;

    /* mapdata.map((el) => {
      let stok = createStock({});
    });*/

    res.status(200).send(response);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
