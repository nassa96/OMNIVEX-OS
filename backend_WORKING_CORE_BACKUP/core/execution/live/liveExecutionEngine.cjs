const BinanceExecutor = require("./binanceExecutor.cjs");
const CoinbaseExecutor = require("./coinbaseExecutor.cjs");

/**
 * SAINT V14 — LIVE EXECUTION ENGINE
 * --------------------------------
 * Unified gateway to real exchanges
 */

class LiveExecutionEngine {

  constructor() {

    this.binance = new BinanceExecutor();
    this.coinbase = new CoinbaseExecutor();
  }

  async execute(order) {

    if (order.venue === "binance") {
      return await this.binance.placeOrder(order);
    }

    if (order.venue === "coinbase") {
      return await this.coinbase.placeOrder(order);
    }

    return {
      status: "FAILED",
      reason: "UNKNOWN_VENUE"
    };
  }
}

module.exports = LiveExecutionEngine;
