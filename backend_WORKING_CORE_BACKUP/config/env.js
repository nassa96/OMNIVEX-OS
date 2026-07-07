import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  COINBASE_KEY: process.env.COINBASE_KEY,
  BINANCE_KEY: process.env.BINANCE_KEY,
  KRAKEN_KEY: process.env.KRAKEN_KEY,

  MODE: process.env.MODE || "PAPER",

  /* SAFETY OVERRIDES */
  LIVE_TRADING_ENABLED: process.env.MODE === "LIVE",
  KILL_SWITCH: process.env.KILL_SWITCH === "true"
};
