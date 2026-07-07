"use strict";

const binance = require("./adapters/binance_us");
const kraken = require("./adapters/kraken");
const coinbase = require("./adapters/coinbase");
const hyperliquid = require("./adapters/hyperliquid");

function selectVenue({ signals, risk }) {
  if (!risk?.approved) return "COINBASE";

  const v = signals?.cerberus?.volatility || 0.5;
  const s = signals?.sophia?.strength || 0.5;

  if (v > 0.75) return "HYPERLIQUID";
  if (s > 0.7) return "BINANCE";
  if (s > 0.5) return "KRAKEN";

  return "COINBASE";
}

async function execute({ decision, market, signals, risk }) {
  const venue = selectVenue({ signals, risk });

  switch (venue) {
    case "BINANCE":
      return binance.execute({ decision, market });

    case "KRAKEN":
      return kraken.execute({ decision, market });

    case "HYPERLIQUID":
      return hyperliquid.execute({ decision, market });

    default:
      return coinbase.execute({ decision, market });
  }
}

module.exports = {
  execute,
  selectVenue
};
