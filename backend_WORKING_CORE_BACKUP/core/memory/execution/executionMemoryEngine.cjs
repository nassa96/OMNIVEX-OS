/**
 * SAINT V26 — EXECUTION MEMORY LAYER
 * ----------------------------------
 * Learns from execution outcomes over time
 */

class ExecutionMemoryEngine {

  constructor() {

    this.records = [];
    this.max = 5000;
  }

  // =====================================================
  // STORE EXECUTION RESULT
  // =====================================================
  record(execution) {

    this.records.push({
      tradeId: execution.tradeId,
      symbol: execution.symbol,
      venue: execution.venue,
      side: execution.side,

      slippage: execution.slippage || 0,
      fillSpeed: execution.fillSpeed || 0,
      health: execution.health || 0,

      pnl: execution.pnl || 0,
      regime: execution.regime || "UNKNOWN",
      flowState: execution.flowState || "UNKNOWN",

      ts: Date.now()
    });

    if (this.records.length > this.max) {
      this.records.shift();
    }
  }

  // =====================================================
  // VENUE PERFORMANCE MODEL
  // =====================================================
  venueStats() {

    const stats = {};

    for (const r of this.records) {

      if (!stats[r.venue]) {
        stats[r.venue] = {
          avgSlippage: 0,
          avgPnL: 0,
          count: 0
        };
      }

      const s = stats[r.venue];

      s.avgSlippage += r.slippage;
      s.avgPnL += r.pnl;
      s.count += 1;
    }

    for (const v in stats) {
      stats[v].avgSlippage /= stats[v].count;
      stats[v].avgPnL /= stats[v].count;
    }

    return stats;
  }

  // =====================================================
  // REGIME EXECUTION QUALITY
  // =====================================================
  regimeStats() {

    const stats = {};

    for (const r of this.records) {

      const key = r.regime;

      if (!stats[key]) {
        stats[key] = {
          avgSlippage: 0,
          avgPnL: 0,
          count: 0
        };
      }

      stats[key].avgSlippage += r.slippage;
      stats[key].avgPnL += r.pnl;
      stats[key].count += 1;
    }

    for (const k in stats) {
      stats[k].avgSlippage /= stats[k].count;
      stats[k].avgPnL /= stats[k].count;
    }

    return stats;
  }

  // =====================================================
  // FLOW CONDITION PERFORMANCE
  // =====================================================
  flowStats() {

    const stats = {};

    for (const r of this.records) {

      const key = r.flowState;

      if (!stats[key]) {
        stats[key] = {
          avgSlippage: 0,
          avgPnL: 0,
          count: 0
        };
      }

      stats[key].avgSlippage += r.slippage;
      stats[key].avgPnL += r.pnl;
      stats[key].count += 1;
    }

    for (const k in stats) {
      stats[k].avgSlippage /= stats[k].count;
      stats[k].avgPnL /= stats[k].count;
    }

    return stats;
  }

  // =====================================================
  // EXECUTION QUALITY SCORE (GLOBAL)
  // =====================================================
  qualityScore() {

    if (this.records.length < 10) return 0;

    const recent = this.records.slice(-200);

    const avgPnL =
      recent.reduce((a, b) => a + (b.pnl || 0), 0) / recent.length;

    const avgSlippage =
      recent.reduce((a, b) => a + (b.slippage || 0), 0) / recent.length;

    return avgPnL - (avgSlippage * 10);
  }

  // =====================================================
  // BEST VENUE RECOMMENDATION
  // =====================================================
  bestVenue() {

    const stats = this.venueStats();

    let best = null;
    let bestScore = -Infinity;

    for (const v in stats) {

      const score =
        stats[v].avgPnL - (stats[v].avgSlippage * 5);

      if (score > bestScore) {
        bestScore = score;
        best = v;
      }
    }

    return { best, bestScore };
  }
}

module.exports = ExecutionMemoryEngine;
