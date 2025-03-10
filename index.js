require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const cors = require("cors");
const webSocketImplementation = require("./websocket");

app.use(cors());
app.use(express.json());
var BreezeConnect = require("breezeconnect").BreezeConnect;

var appKey = "5(412`OS2U50050a97845797Y669o23$";
var appSecret = "85Ht253E2Ye22o1931S0u36y50eQ08X4";

var breeze = new BreezeConnect({ appKey: appKey });
breeze
  .generateSession(appSecret, "50731473")
  .then(function (resp) {
    app.post("/api/historicalData", (req, res) => {
      try {
        const {
          interval,
          fromDate,
          toDate,
          stockCode,
          exchangeCode,
          productType,
        } = req.body;
        console.log(req.body);
        breeze
          .getHistoricalData({
            interval, //'1minute', '5minute', '30minute','1day'
            fromDate,
            toDate,
            stockCode,
            exchangeCode: "NSE", // 'NSE','BSE','NFO'
            productType: "cash",
          })
          .then(function (resp) {
            res.status(200).send({ data: resp });
          });
      } catch (error) {
        console.log(error);
      }
    });
    webSocketImplementation();
  })
  .catch(function (err) {
    console.log(err);
  });

app.post("/api/save-json", (req, res) => {
  try {
    const json = req.body;
    const filePath = path.join(__dirname, "../client/src/apis/stockCodes.json");

    fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to save file" });
      } else {
        res.status(200).json({ message: "File updated successfully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen("3000", () => {
  console.log("server is running on port 3000");
});
