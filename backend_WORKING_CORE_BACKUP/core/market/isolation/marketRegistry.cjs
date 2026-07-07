const ExchangeBook = require("./exchangeBook.cjs");

/**
 * SAINT V32 — MARKET REGISTRY
 * ---------------------------
 * Holds independent orderbooks per exchange
 * Enables cross-venue divergence detection
 */

class MarketRegistry {

  constructor() {
    this.books = {
      binance: new ExchangeBook("binance"),
      coinbase: new ExchangeBook("coinbase"),
      kraken: new ExchangeBook("kraken")
    };
  }

  update(exchange, data) {
    if (!this.books[exchange]) return;
    this.books[exchange].update(data);
  }

  snapshotAll() {
    return Object.fromEntries(
      Object.entries(this.books).map(([k,v]) => [k, v.snapshot()])
    );
  }

  // ---------------------------
  // CROSS-EXCHANGE DIVERGENCE
  // ---------------------------
  detectDivergence() {

    const snap = this.snapshotAll();

    const venues = Object.values(snap);

    const mids = venues.map(v => v.mid);
    const spreads = venues.map(v => v.spread);
    const liquidity = venues.map(v => v.liquidity);

    const maxMid = Math.max(...mids);
    const minMid = Math.min(...mids);

    const priceDivergence = maxMid - minMid;

    const liquidityImbalance =
      Math.max(...liquidity) / (Math.min(...liquidity) + 1);

    const spreadStress =
      spreads.reduce((a,b)=>a+b,0) / spreads.length;

    return {
      priceDivergence,
      liquidityImbalance,
      spreadStress,
      regime:
        priceDivergence > 50 ? "FRAGMENTED" :
        liquidityImbalance > 3 ? "UNBALANCED" :
        "NORMAL"
    };
  }
}

module.exports = MarketRegistry;
