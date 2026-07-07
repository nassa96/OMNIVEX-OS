/**
 * SAINT V18 — MARKET REGIME DETECTION ENGINE
 * -----------------------------------------
 * Converts raw market data into structured market state
 */

class RegimeEngine {

  constructor() {

    this.history = [];
    this.maxHistory = 200;
  }

  // ---------------------------
  // INGEST MARKET SNAPSHOT
  // ---------------------------
  ingest(market) {

    this.history.push({
      price: market.price,
      volume: market.volume || 1,
      spread: market.spread?.spread || 0,
      liquidity: market.liquidity || 1,
      ts: Date.now()
    });

    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
  }

  // ---------------------------
  // VOLATILITY REGIME
  // ---------------------------
  volatilityRegime() {

    if (this.history.length < 10) return "UNKNOWN";

    const returns = [];

    for (let i = 1; i < this.history.length; i++) {
      const r =
        (this.history[i].price - this.history[i - 1].price) /
        this.history[i - 1].price;

      returns.push(Math.abs(r));
    }

    const avgVol =
      returns.reduce((a, b) => a + b, 0) / returns.length;

    if (avgVol < 0.0005) return "LOW";
    if (avgVol < 0.002) return "EXPANDING";
    if (avgVol < 0.01) return "HIGH";
    return "CHAOTIC";
  }

  // ---------------------------
  // TREND REGIME
  // ---------------------------
  trendRegime() {

    if (this.history.length < 20) return "UNKNOWN";

    const first = this.history[0].price;
    const last = this.history[this.history.length - 1].price;

    const change = (last - first) / first;

    if (change > 0.01) return "UP";
    if (change < -0.01) return "DOWN";

    // detect compression
    const range =
      Math.max(...this.history.map(h => h.price)) -
      Math.min(...this.history.map(h => h.price));

    const avg = this.history.reduce((a,b)=>a+b.price,0)/this.history.length;

    if (range / avg < 0.005) return "RANGE";

    return "BREAKOUT";
  }

  // ---------------------------
  // LIQUIDITY REGIME
  // ---------------------------
  liquidityRegime() {

    if (this.history.length < 10) return "UNKNOWN";

    const avgLiquidity =
      this.history.reduce((a,b)=>a + (b.liquidity || 1), 0) /
      this.history.length;

    if (avgLiquidity > 100000) return "DEEP";
    if (avgLiquidity > 50000) return "NORMAL";
    if (avgLiquidity > 10000) return "THIN";

    return "DISLOCATED";
  }

  // ---------------------------
  // FULL REGIME STATE
  // ---------------------------
  analyze(market) {

    this.ingest(market);

    return {
      volatility: this.volatilityRegime(),
      trend: this.trendRegime(),
      liquidity: this.liquidityRegime()
    };
  }
}

module.exports = RegimeEngine;
