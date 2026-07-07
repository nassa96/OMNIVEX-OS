/**
 * SAINT V52 — MERCURY LIQUIDITY BUS
 */

class MercuryBusV52 {

  constructor() {

    this.state = {
      price: {},
      liquidity: {},
      microstructure: {}
    };
  }

  updatePrice(symbol, price, source) {

    if (!this.state.price[symbol]) {
      this.state.price[symbol] = {};
    }

    this.state.price[symbol][source] = price;
  }

  getPrice(symbol) {

    const values = Object.values(this.state.price[symbol] || {});

    if (!values.length) return null;

    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  computeMicrostructure(symbol) {

    const liq = this.state.liquidity[symbol];

    if (!liq) return null;

    const pressure =
      liq.imbalance * (1 / (liq.spread + 0.0001));

    return {
      spread: liq.spread,
      imbalance: liq.imbalance,
      pressure
    };
  }

  snapshot(symbol = "ETH-USD") {

    return {
      symbol,
      price: this.getPrice(symbol),
      liquidity: this.state.liquidity[symbol],
      microstructure: this.computeMicrostructure(symbol)
    };
  }
}

module.exports = MercuryBusV52;
