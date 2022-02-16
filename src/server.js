import express from "express";
import pkg from "express";
const { Request, Response, NextFunction } = pkg;
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as socketio from "socket.io";
import http from "http";
import BaseRouter from "./routes/index.js";
//import { getBars, getAnalysis } from "./services/alphaca.js";
///import YSP from "yahoo-stock-prices";
import { getEma } from "./lib/ema.js";
import { Sequelize } from "sequelize";
//import db from "./config/db.js";

import { reloadSession } from "./services/login.js";

dotenv.config();

// Database Connection
const URI = process.env.CONNECTION_STRING;

const sequelize = new Sequelize(URI, {
  dialect: "postgres",
  /*dialectOptions: {
    ssl: true,
  },*/
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: false,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const app = express();
//const watchlist = ["FB", "AC.TO"];

//testing meta stock
//TO:DO load stock from DB
let stocks = ["FB:NASDAQ"];

let targets = [];
//TODO : store those values into db linked to the specific symbol
let sma20, sma50, next20, next50;
let lastOrder = "SELL";

let stopLoss = 2; //loosing limit 2% under entry position

const init = async () => {
  const symbol = stocks[0];
  await reloadSession();
  try {
    const data = await getEma({ symbol });

    sma20 = data.sma20.slice(-1)[0];
    sma50 = data.sma50.slice(-1)[0];

    console.log("current sma20:", sma20);
    console.log("current sma50:", sma50);
  } catch (error) {
    console.log("get current EMA error");
  }

  // EMA crossOver Strategy
  //https://hackernoon.com/trading-with-moving-averages-smas-and-emas-k1143wf7
  const checkAndOrder = async () => {
    try {
      const oneMinuteMS = 60000;
      const now = new Date();
      const start = new Date(now - 2 * oneMinuteMS).toISOString();
      const end = new Date(now - oneMinuteMS).toISOString();

      //EMA CROSS-OVER strategy

      if (next20 === undefined && next50 === undefined) {
        let data = await getEma({ symbol });
        next20 = data.sma20.slice(-1)[0];
        next50 = data.sma50.slice(-1)[0];

        console.log("next20:", next20);
        console.log("next50:", next50);
      } else {
        sma20 = next20;
        sma50 = next50;

        console.log("current sma20:", sma20);
        console.log("current sma50:", sma50);

        let data = await getEma({ symbol });
        next20 = data.sma20.slice(-1)[0];
        next50 = data.sma50.slice(-1)[0];

        console.log("next20:", next20);
        console.log("next50:", next50);
      }

      if (next20 > next50 && lastOrder !== "BUY") {
        //EMA crossover occurs
        console.log("buy signal happened here ");
      } else if (next20 < next50 && lastOrder !== "SELL") {
        //EMA crossover occurs
        console.log("sell  signal happened here ");
      }
    } catch (error) {
      console.log(error);
    }
  };

  setInterval(checkAndOrder, 2000);
};

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(cors());

// Add APIs
app.use("/api", BaseRouter);

const server = http.createServer(app);

const wss = new socketio.Server({
  cors: {
    origin: "*",
  },
});

wss.attach(server);

let interval;

const getApiAndEmit = async (socket) => {
  // Emitting a new message. Will be consumed by the client
  socket.emit("reload", "reload");
};


//init Websocket ws and handle incoming connect requests
wss.on("connection", function connection(ws) {
  console.log(`${ws.id} is connected`);

  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(ws), 60 * 1000);

  ws.on("disconnect", function (msg) {
    console.log(`${ws.id} DisConnected`);
    clearInterval(interval);
  });
});

// Start the server
const port = Number(process.env.PORT || 4000);
server.listen(port, () => {
  console.log("Express server started on port: " + port);
});

init();
