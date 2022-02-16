"use strict";

export const stock = (sequelize, DataTypes) => {
  const Stock = sequelize.define(
    "stock",
    {
      symbol: { type: DataTypes.STRING, primaryKey: false, unique: true },
      companyName: { type: DataTypes.STRING, field: "company" },
      marketName: { type: DataTypes.STRING, field: "market_name" },
      currency: { type: DataTypes.STRING },
      sector: { type: DataTypes.STRING },
      change: { type: DataTypes.DECIMAL },
      quantity: { type: DataTypes.DECIMAL },
      avgcost: { type: DataTypes.DECIMAL },
      changePercent: { type: DataTypes.DECIMAL, field: "change_percent" },
      totalChange: { type: DataTypes.DECIMAL, field: "total_change" },
      totalChangePercent: {
        type: DataTypes.DECIMAL,
        field: "total_change_percent",
      },
      open: { type: DataTypes.DECIMAL },
      close: { type: DataTypes.DECIMAL },
      latestPrice: { type: DataTypes.DECIMAL, field: "latest_price" },
      latestVolume: { type: DataTypes.INTEGER, field: "latest_volume" },
      marketCap: { type: DataTypes.BIGINT, field: "marketcap" },
      peRatio: { type: DataTypes.DECIMAL, field: "pe_ratio" },
      week52High: { type: DataTypes.DECIMAL, field: "week52high" },
      week52Low: { type: DataTypes.DECIMAL, field: "week52low" },
      ytdChange: { type: DataTypes.DECIMAL, field: "ytdchange" },
      lastSignal: { type: DataTypes.STRING, field: "signal" },
    },
    {
      paranoid: true,
      underscored: true,
    }
  );
  return Stock;
};
