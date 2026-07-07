/**
 * SAINT V34 — EXECUTION FEEDBACK MEMORY
 * -------------------------------------
 * Learns from:
 * - fills
 * - slippage
 * - prediction accuracy
 * - venue performance
 */

class ExecutionMemory {

  constructor() {
    this.records = [];
    this.maxSize = 500;
  }

  record(execution, prediction, market, venue, regime) {

    const slippage =
      Math.abs((execution.price || market.mid) - market.mid);

    const wasGoodFill =
      execution.status === "EXECUTED" && slippage < market.spread * 0.5;

    const accuracy =
      prediction.executionScore
        ? Math.max(0, 1 - Math.abs(prediction.executionScore - (wasGoodFill ? 1 : 0)))
        : 0;

    const record = {
      venue,
      regime,
      execution,
      prediction,
      slippage,
      wasGoodFill,
      accuracy,
      ts: Date.now()
    };

    this.records.push(record);

    if (this.records.length > this.maxSize) {
      this.records.shift();
    }

    return record;
  }

  // ---------------------------
  // VENUE PERFORMANCE SCORE
  // ---------------------------
  getVenueStats(venue) {

    const subset = this.records.filter(r => r.venue === venue);

    if (!subset.length) {
      return {
        venue,
        score: 0.5,
        samples: 0
      };
    }

    const avgAccuracy =
      subset.reduce((a,b) => a + b.accuracy, 0) / subset.length;

    const goodFillRate =
      subset.filter(r => r.wasGoodFill).length / subset.length;

    const avgSlippage =
      subset.reduce((a,b) => a + b.slippage, 0) / subset.length;

    const score =
      (avgAccuracy * 0.4) +
      (goodFillRate * 0.4) -
      (avgSlippage * 0.2);

    return {
      venue,
      score,
      avgAccuracy,
      goodFillRate,
      avgSlippage,
      samples: subset.length
    };
  }

  // ---------------------------
  // GLOBAL INTELLIGENCE SIGNAL
  // ---------------------------
  getLearningSignal() {

    const recent = this.records.slice(-50);

    const successRate =
      recent.filter(r => r.wasGoodFill).length / (recent.length || 1);

    const avgAccuracy =
      recent.reduce((a,b) => a + b.accuracy, 0) / (recent.length || 1);

    return {
      successRate,
      avgAccuracy,
      confidence:
        successRate > 0.6 && avgAccuracy > 0.6
          ? "IMPROVING"
          : "UNSTABLE"
    };
  }
}

module.exports = ExecutionMemory;
