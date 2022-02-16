import fetch from "node-fetch";

import { getHistory } from "./positions.js";
import { JSDOM } from "jsdom";

export const getBars = async ({ symbol, start, end }) => {
  try {
    /*const resp = await fetch(
      `https://data.alpaca.markets/v1/bars/minute?symbols=${symbol}&start=${start}&end=${end}`,
      {
        headers: {
          "APCA-API-KEY-ID": process.env.APIKEY,
          "APCA-API-SECRET-KEY": process.env.SECRET,
        },
      }
    );*/
    const history = await getHistory(symbol, "1d", -1);
    //const HistoryForBar = history.ma;
    return history;
  } catch (e) {
    console.log(e);
  }
};

export const getAnalysis = async ({ symbol }) => {
  try {
    const resp = await fetch(
      `https://finance.yahoo.com/quote/${symbol}/analysis?p=${symbol}`
    )
      .then((res) => res.text())
      .then((text) => {
        const dom = new JSDOM(text);
        let children = dom.window.document.body.children.length;
        console.log(children);
        /* dom.window.document.body.children.forEach((el) => console.log(el));
        console.log(dom.window.document.body.children);
        let spli = text.split(
          `<section data-test="qsp-analyst" class="smartphone_Px(20px) smartphone_Pt(10px)" data-yaft-module="tdv2-applet-AnalystLeafPage">`
        );
        spli.forEach((el) => console.log(el));
        console.log(
          dom.window.document.body.innerHTML.split(
            `<section data-test="qsp-analyst" class="smartphone_Px(20px) smartphone_Pt(10px)" data-yaft-module="tdv2-applet-AnalystLeafPage">`
          )
        );*/
        let val = new JSDOM(
          dom.window.document.body
            .querySelector("section")
            .outerHTML.split(`<table>`)[0]
        ).window.document.body.innerHTML; /*
          .split(
            '<table class="W(100%) M(0) BdB Bdc($seperatorColor) Mb(25px)">'
          );*/
        val.forEach((el) => console.log(el));
        console.log(
          dom.window.document.body
            .querySelector("section")
            .outerHTML.split(
              `<section data-test="qsp-analyst" class="smartphone_Px(20px) smartphone_Pt(10px)" data-yaft-module="tdv2-applet-AnalystLeafPage">`
            )
        );
        //spli.forEach((el) => console.log(el));
      });
    //console.log(resp.text());
    //return resp.json();
  } catch (e) {
    console.log(e);
  }
};
