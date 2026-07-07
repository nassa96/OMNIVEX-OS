/**
 * OMNIVEX COMPOUNDING ENGINE
 *
 * Rules:
 * - winners get increased allocation
 * - losers get capital decay
 * - exposure scales with equity curve
 */

const portfolio = require("../metrics/portfolioState");

class CompoundingEngine {

  calculatePositionSize(signal) {
    const state = portfolio.getState();

    const baseRisk = 0.02; // 2% base risk per trade

    // drawdown protection
    const drawdownModifier =
      state.drawdown > 0.2 ? 0.5 :
      state.drawdown > 0.1 ? 0.7 : 1;

    // conviction scaling from Cerberus
    const convictionMultiplier =
      signal.conviction === "HIGH" ? 2 :
      signal.conviction === "MEDIUM" ? 1 :
      0.5;

    // equity compounding
    const equityScale = state.equity / 10000;

    const positionSize =
      state.equity *
      baseRisk *
      drawdownModifier *
      convictionMultiplier *
      equityScale;

    return {
      symbol: signal.symbol,
      sizeUSD: Math.max(positionSize, 10),
      riskAdjusted: true,
      equity: state.equity,
      drawdown: state.drawdown
    };
  }

  rebalance(signals) {
    const positions = signals.map(s => this.calculatePositionSize(s));

    return {
      timestamp: Date.now(),
      equity: portfolio.getState().equity,
      positions
    };
  }
}

module.exports = new CompoundingEngine();
