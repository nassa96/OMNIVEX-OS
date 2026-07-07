/**
 * SAINT V51 — MERCURY MARKET BUS
 * --------------------------------
 * Normalizes all exchange feeds into unified state
 */

class MercuryBusV51 {

  constructor() {

    this.state = {
      price: {},
      volume: {},
      liquidity: {},
      orderFlow: {}
    };
  }

  // =====================================================
  // UPDATE PRICE
  // =====================================================
  updatePrice(symbol, price, source) {

    if (!this.state.price[symbol]) {
      this.state.price[symbol] = {};
    }

    this.state.price[symbol][source] = price;
  }

  // =====================================================
  // GET NORMALIZED PRICE
  // =====================================================
  getPrice(symbol) {

    const sources = this.state.price[symbol] || {};
    const values = Object.values(sources);

    if (values.length === 0) return null;

    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  snapshot(symbol = "ETH") {

    return {
      symbol,
      price: this.getPrice(symbol),
      sources: this.state.price[symbol] || {}
    };
  }
}

module.exports = MercuryBusV51;
