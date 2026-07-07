/**
 * SAINT V17 — PORTFOLIO INTELLIGENCE ENGINE
 * -----------------------------------------
 * Global exposure + PnL + risk aggregation layer
 */

class PortfolioEngine {

  constructor() {

    this.positions = new Map(); // symbol -> position
    this.totalExposure = 0;
    this.realizedPnL = 0;
    this.unrealizedPnL = 0;
  }

  // ---------------------------
  // UPDATE POSITION AFTER TRADE
  // ---------------------------
  applyTrade(trade) {

    const symbol = trade.symbol || "BTC";

    const existing = this.positions.get(symbol) || {
      qty: 0,
      avgPrice: 0,
      exposure: 0
    };

    const newQty = existing.qty + trade.qty;

    const newAvg =
      newQty === 0
        ? 0
        : ((existing.avgPrice * existing.qty) +
           (trade.price * trade.qty)) / newQty;

    const position = {
      qty: newQty,
      avgPrice: newAvg,
      exposure: Math.abs(newQty * newAvg)
    };

    this.positions.set(symbol, position);

    this.recalculateExposure();
  }

  // ---------------------------
  // RECALCULATE GLOBAL EXPOSURE
  // ---------------------------
  recalculateExposure() {

    let total = 0;

    for (const p of this.positions.values()) {
      total += p.exposure;
    }

    this.totalExposure = total;
  }

  // ---------------------------
  // UPDATE MARKET PRICES
  // ---------------------------
  updateMarketPrices(prices) {

    let unrealized = 0;

    for (const [symbol, pos] of this.positions.entries()) {

      const price = prices[symbol] || pos.avgPrice;

      unrealized += (price - pos.avgPrice) * pos.qty;
    }

    this.unrealizedPnL = unrealized;
  }

  // ---------------------------
  // EXPOSURE RISK SCORE
  // ---------------------------
  riskScore() {

    const exposureRisk =
      Math.min(1, this.totalExposure / 100000);

    const pnlStress =
      this.unrealizedPnL < 0
        ? Math.min(1, Math.abs(this.unrealizedPnL) / 10000)
        : 0;

    return Math.min(1, exposureRisk + pnlStress);
  }

  // ---------------------------
  // PORTFOLIO SNAPSHOT
  // ---------------------------
  snapshot() {

    return {
      positions: Object.fromEntries(this.positions),
      totalExposure: this.totalExposure,
      realizedPnL: this.realizedPnL,
      unrealizedPnL: this.unrealizedPnL,
      riskScore: this.riskScore()
    };
  }
}

module.exports = PortfolioEngine;
