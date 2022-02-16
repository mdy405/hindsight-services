import { ema } from "technicalindicators";
import { getHistory } from "../services/positions.js";
import axios from "axios";
import moment from "moment";

const secret = "sk_53459ed7339444a68cc1d1f6549548ce";
const tokens = "pk_ff4d10037ecc4201bb063b44e4dc20f4";

// Get data for a single stock
const apiURL = "https://api.iextrading.com/1.0";

//
const freeApi = "https://cloud.iexapis.com/stable/stock";

const timSeries = "https://cloud.iexapis.com/stable/stock";

const getTimeSeries = (symbol) => {
  const time = moment().format("YYYYMMDD");
  return axios
    .get(`${timSeries}/${symbol}/chart/date/${time}?token=${tokens}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const getStockData = (stock) => {
  return axios
    .get(`${freeApi}/${stock}/quote?token=${tokens}`)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

export const getEma = async ({ symbol }) => {
  try {
    let val = symbol.split(":")[0];

    //comment this to use WS data
    let timeSeries = await getTimeSeries(val);

    //uncomment this to use WS data
    ///let timeSeries = await getHistory(symbol, "1m", -1);

    timeSeries = timeSeries.slice(-100); //get last 100 values

    const daycloseValues = timeSeries
      .filter((el) => el.close != null)
      .map((el) => parseFloat(el.close));

    let sma20 = new ema({ period: 20, values: daycloseValues });
    let sma50 = new ema({ period: 50, values: daycloseValues });

    return {
      sma20: sma20,
      sma50: sma50,
    };
  } catch (e) {
    console.log("get EMA error");
  }
};
