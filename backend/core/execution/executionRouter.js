"use strict";

import binance from "./adapters/binance_us.js";
import kraken from "./adapters/kraken.js";
import coinbase from "./adapters/coinbase.js";
import hyperliquid from "./adapters/hyperliquid.js";

function selectVenue(signals, risk) {
  if (!risk?.approved) return "COINBASE";

  const v = signals?.cerberus?.volatility || 0.5;
  const s = signals?.sophia?.strength || 0.5;

  if (v > 0.7) return "HYPERLIQUID";
  if (s > 0.65) return "BINANCE";
  if (s > 0.45) return "KRAKEN";

  return "COINBASE";
}

export async function execute(payload) {
  const venue = selectVenue(payload.signals, payload.risk);

  switch (venue) {
    case "BINANCE":
      return binance.execute(payload);

    case "KRAKEN":
      return kraken.execute(payload);

    case "HYPERLIQUID":
      return hyperliquid.execute(payload);

    default:
      return coinbase.execute(payload);
  }
}

export default {
  execute,
  selectVenue
};
