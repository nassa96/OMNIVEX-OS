"use strict";

import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  live: process.env.ENABLE_LIVE_TRADING === "true",

  binance: {
    key: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_API_SECRET
  },

  kraken: {
    key: process.env.KRAKEN_API_KEY,
    secret: process.env.KRAKEN_API_SECRET
  },

  coinbase: {
    key: process.env.COINBASE_API_KEY,
    secret: process.env.COINBASE_API_SECRET
  },

  hyperliquid: {
    wallet: process.env.WALLET_ADDRESS,
    privateKey: process.env.PRIVATE_KEY
  }
};

export default CONFIG;
