/**
 * SAINT V39 — PnL-DRIVEN LEARNING ENGINE
 * --------------------------------------
 * Converts trade history → behavioral adaptation signals
 */

class PnLLearner {

  constructor(positionEngine) {
    this.positions = positionEngine;
    this.weights = {
      binance: 1.0,
      coinbase: 1.0,
      kraken: 1.0
    };

    this.regimeBias = {
      SWEEP: 1.0,
      IGNITION: 1.0,
      TOXIC: 1.0,
      NORMAL: 1.0
    };
  }

  // ---------------------------
  // VENUE PROFIT ANALYSIS
  // ---------------------------
  updateVenueWeights() {

    const stats = this.positions.getStats?.() || {};

    const history = this.positions.history || [];

    const venuePnL = {
      binance: 0,
      coinbase: 0,
      kraken: 0
    };

    const counts = {
      binance: 0,
      coinbase: 0,
      kraken: 0
    };

    for (const trade of history) {
      if (!trade.venue) continue;

      venuePnL[trade.venue] += trade.pnl || 0;
      counts[trade.venue] += 1;
    }

    for (const v of Object.keys(this.weights)) {

      const avgPnL =
        counts[v] > 0 ? venuePnL[v] / counts[v] : 0;

      // convert PnL into soft weight adjustment
      const adjustment =
        avgPnL > 0 ? 1.05 :
        avgPnL < 0 ? 0.95 : 1;

      this.weights[v] *= adjustment;

      // clamp
      this.weights[v] = Math.max(0.3, Math.min(2.5, this.weights[v]));
    }
  }

  // ---------------------------
  // REGIME PROFIT LEARNING
  // ---------------------------
  updateRegimeBias() {

    const history = this.positions.history || [];

    const regimePnL = {
      SWEEP: 0,
      IGNITION: 0,
      TOXIC: 0,
      NORMAL: 0
    };

    const counts = { ...regimePnL };

    for (const t of history) {
      const r = t.regime || "NORMAL";

      regimePnL[r] += t.pnl || 0;
      counts[r] += 1;
    }

    for (const r of Object.keys(this.regimeBias)) {

      const avg =
        counts[r] > 0 ? regimePnL[r] / counts[r] : 0;

      const adj =
        avg > 0 ? 1.1 :
        avg < 0 ? 0.9 : 1;

      this.regimeBias[r] *= adj;

      this.regimeBias[r] = Math.max(0.2, Math.min(3, this.regimeBias[r]));
    }
  }

  // ---------------------------
  // SYSTEM INTELLIGENCE SIGNAL
  // ---------------------------
  getSystemState() {

    const learning = this.positions.getStats?.() || {};

    const profitBias =
      learning.totalPnL > 0 ? "POSITIVE" : "NEGATIVE";

    const confidence =
      learning.winRate > 0.55 ? "IMPROVING" : "UNSTABLE";

    return {
      profitBias,
      confidence,
      winRate: learning.winRate,
      pnl: learning.totalPnL
    };
  }

  // ---------------------------
  // MAIN UPDATE LOOP
  // ---------------------------
  update() {
    this.updateVenueWeights();
    this.updateRegimeBias();
  }
}

module.exports = PnLLearner;
