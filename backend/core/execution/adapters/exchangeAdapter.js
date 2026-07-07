"use strict";

/**
 * ==========================================
 * EXCHANGE ADAPTER CORE v1
 * UNIFIED MARKET EXECUTION INTERFACE
 * ==========================================
 *
 * ROLE:
 * - abstract exchange differences
 * - provide unified order execution API
 * - support paper + live modes
 */

const CONFIG = {
  mode: process.env.EXECUTION_MODE || "paper", // paper | live
  exchange: process.env.EXCHANGE || "mock"
};

/**
 * ==========================
 * PLACE ORDER (UNIFIED API)
 * ==========================
 */
export async function placeOrder(intent) {
  if (CONFIG.mode === "paper") {
    return paperOrder(intent);
  }

  return liveOrder(intent);
}

/**
 * ==========================
 * PAPER TRADING ENGINE
 * ==========================
 */
async function paperOrder(intent) {
  return {
    status: "FILLED_PAPER",
    exchange: "SIMULATED",
    symbol: intent.symbol,
    side: intent.side,
    size: intent.size,
    price: mockPrice(intent.symbol),
    ts: Date.now()
  };
}

/**
 * ==========================
 * LIVE TRADING ENGINE (SAFE SHELL)
 * ==========================
 * Replace internals with real exchange SDK later
 */
async function liveOrder(intent) {
  try {
    /**
     * PLACEHOLDER FOR REAL EXCHANGE INTEGRATION
     * e.g. Binance, Coinbase, Kraken SDK
     */

    return {
      status: "LIVE_ORDER_SENT",
      exchange: CONFIG.exchange,
      symbol: intent.symbol,
      side: intent.side,
      size: intent.size,
      ts: Date.now()
    };
  } catch (err) {
    return {
      status: "FAILED",
      error: err.message,
      ts: Date.now()
    };
  }
}

/**
 * ==========================
 * MOCK PRICE ENGINE
 * ==========================
 */
function mockPrice(symbol) {
  return 100 + Math.random() * 10;
}

export default {
  placeOrder
};
