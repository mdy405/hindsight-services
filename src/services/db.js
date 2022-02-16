import db from "../config/db.js";

export const createStock = (stock) => {
  return db.stock.create(stock);
};

export const getStocksData = () => {
  return db.stock.findAll({
    raw: true,
    order: [["symbol", "ASC"]],
  });
};
