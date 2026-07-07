import { ENV } from "../config/env.js";

/**
 * ROUTES ORDERS TO REAL EXCHANGES
 * THIS IS THE MISSING WIRING LAYER
 */

export async function executeOrder(order) {
  const { exchange, symbol, side, size } = order;

  switch (exchange) {
    case "coinbase":
      return coinbase(order);

    case "binance":
      return binance(order);

    case "kraken":
      return kraken(order);

    default:
      throw new Error("No exchange selected");
  }
}

/* =========================
   COINBASE (PLACEHOLDER REAL HOOK)
========================= */
async function coinbase(order) {
  if (!ENV.COINBASE_KEY) {
    throw new Error("Missing Coinbase API Key");
  }

  // IMPORTANT: here is where your SDK or signed request goes
  return {
    exchange: "coinbase",
    status: "SIM_OR_LIVE_DEPENDS_ON_MODE",
    order
  };
}

/* ========================= */
async function binance(order) {
  if (!ENV.BINANCE_KEY) {
    throw new Error("Missing Binance API Key");
  }

  return {
    exchange: "binance",
    status: "SIM_OR_LIVE_DEPENDS_ON_MODE",
    order
  };
}

/* ========================= */
async function kraken(order) {
  if (!ENV.KRAKEN_KEY) {
    throw new Error("Missing Kraken API Key");
  }

  return {
    exchange: "kraken",
    status: "SIM_OR_LIVE_DEPENDS_ON_MODE",
    order
  };
}
