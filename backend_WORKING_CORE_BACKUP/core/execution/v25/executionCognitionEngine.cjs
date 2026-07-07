/**
 * SAINT V25 — EXECUTION COGNITION LAYER
 * -------------------------------------
 * Real-time adaptive trade control system
 */

class ExecutionCognitionEngine {

  constructor() {

    this.activeTrades = new Map();
  }

  // =====================================================
  // INITIATE EXECUTION TRACKING
  // =====================================================
  startTrade(tradeId, context) {

    this.activeTrades.set(tradeId, {
      symbol: context.symbol,
      side: context.side,
      size: context.size,
      filled: 0,
      avgFillPrice: 0,
      slippage: 0,
      startTime: Date.now(),
      status: "ACTIVE"
    });
  }

  // =====================================================
  // UPDATE FILL PROGRESS
  // =====================================================
  updateFill(tradeId, fill) {

    const t = this.activeTrades.get(tradeId);
    if (!t) return null;

    const newFilled = t.filled + fill.size;

    const newAvg =
      ((t.avgFillPrice * t.filled) + (fill.price * fill.size)) /
      (newFilled || 1);

    t.avgFillPrice = newAvg;
    t.filled = newFilled;

    return t;
  }

  // =====================================================
  // SLIPPAGE DETECTION ENGINE
  // =====================================================
  slippageCheck(trade, marketPrice) {

    const expected = marketPrice;
    const actual = trade.avgFillPrice;

    const slippage =
      Math.abs(actual - expected) / (expected || 1);

    trade.slippage = slippage;

    return slippage;
  }

  // =====================================================
  // EXECUTION HEALTH SCORE
  // =====================================================
  health(trade, marketContext) {

    const slippage = trade.slippage || 0;

    let score = 1;

    // slippage penalty
    if (slippage > 0.005) score -= 0.3;
    if (slippage > 0.01) score -= 0.5;

    // flow degradation penalty
    if (marketContext.flow?.state === "DISTRIBUTION") {
      score -= 0.3;
    }

    // toxicity penalty
    if (marketContext.toxicity?.score > 0.6) {
      score -= 0.4;
    }

    return Math.max(0, score);
  }

  // =====================================================
  // ADAPTIVE EXECUTION DECISION
  // =====================================================
  adapt(tradeId, marketContext) {

    const trade = this.activeTrades.get(tradeId);
    if (!trade) return null;

    const health = this.health(trade, marketContext);

    let action = "HOLD";

    // -------------------------
    // POOR EXECUTION QUALITY
    // -------------------------
    if (health < 0.4) {
      action = "REDUCE";
    }

    // -------------------------
    // EXTREME DETERIORATION
    // -------------------------
    if (health < 0.2) {
      action = "CANCEL_REMAINING";
    }

    // -------------------------
    // STRONG FLOW SUPPORT
    // -------------------------
    if (marketContext.flow?.state === "ACCUMULATION" &&
        health > 0.7) {
      action = "ACCELERATE";
    }

    trade.status = action;

    return {
      tradeId,
      action,
      health,
      slippage: trade.slippage,
      filled: trade.filled,
      remaining: trade.size - trade.filled
    };
  }

  // =====================================================
  // FULL TRADE SNAPSHOT
  // =====================================================
  snapshot(tradeId) {

    return this.activeTrades.get(tradeId);
  }
}

module.exports = ExecutionCognitionEngine;
