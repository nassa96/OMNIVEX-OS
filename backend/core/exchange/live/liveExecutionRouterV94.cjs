/**
 * SAINT V94 — LIVE EXECUTION ROUTER
 */

class LiveExecutionRouterV94 {

  constructor({ binance, coinbase }) {
    this.binance = binance;
    this.coinbase = coinbase;
  }

  route(order) {

    if (order.symbol.includes("BTC")) {
      return this.binance.placeOrder(order);
    }

    return this.coinbase.placeOrder(order);
  }
}

module.exports = LiveExecutionRouterV94;
