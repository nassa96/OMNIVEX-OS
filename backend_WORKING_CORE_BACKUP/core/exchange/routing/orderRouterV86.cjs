/**
 * SAINT V86 — ORDER ROUTER
 */

class OrderRouterV86 {

  route(order) {

    if (order.risk > 0.8) return "SAFE_MODE";
    if (order.symbol.includes("BTC")) return "BINANCE_US";
    return "COINBASE";
  }
}

module.exports = OrderRouterV86;
