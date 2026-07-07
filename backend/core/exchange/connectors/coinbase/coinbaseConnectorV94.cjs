/**
 * SAINT V94 — COINBASE CONNECTOR
 */

class CoinbaseConnectorV94 {

  async placeOrder(order) {

    return {
      exchange: "COINBASE",
      status: "SUBMITTED",
      order,
      ts: Date.now()
    };
  }

  async getPrice(symbol) {

    return {
      symbol,
      price: Math.random() * 100000,
      exchange: "COINBASE"
    };
  }
}

module.exports = CoinbaseConnectorV94;
