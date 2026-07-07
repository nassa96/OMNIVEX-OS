/**
 * SAINT V10 — EXECUTION QUALITY ENGINE
 * ------------------------------------
 * Converts signal → real-world tradability score
 */

class ExecutionQualityEngine {

  constructor() {}

  // ---------------------------
  // MAIN QUALITY ASSESSMENT
  // ---------------------------
  evaluate(signal, market, liquidity) {

    const spread = market?.spread?.spread || 0;
    const mid = market?.spread?.mid || 1;

    const depth = liquidity?.depth || {};
    const totalDepth = depth.totalDepth || 1;

    const volatility = Math.abs(market?.momentum || 0);

    // ---------------------------
    // 1. SLIPPAGE ESTIMATE
    // ---------------------------
    const spreadCost = spread / mid;

    const depthImpact =
      1 / Math.log10(totalDepth + 10);

    const estimatedSlippage =
      spreadCost + depthImpact + (volatility / 1000);

    // ---------------------------
    // 2. FILL PROBABILITY
    // ---------------------------
    const sizePressure =
      signal?.confidence * 100;

    const fillProbability =
      Math.max(0, 1 - (sizePressure / (totalDepth + 1)));

    // ---------------------------
    // 3. ADVERSE SELECTION RISK
    // ---------------------------
    const adverseSelection =
      volatility > 50 ? 0.4 : 0.1;

    // ---------------------------
    // 4. TIMING PENALTY
    // ---------------------------
    const latencyPenalty =
      market?.latencyModel
        ? (market.latencyModel.binance || 0) / 5000
        : 0.1;

    // ---------------------------
    // 5. FINAL EXECUTION SCORE
    // ---------------------------
    let score =
      1
      - estimatedSlippage
      - (1 - fillProbability)
      - adverseSelection
      - latencyPenalty;

    score = Math.max(0, Math.min(1, score));

    // ---------------------------
    // TRADE DECISION GATE
    // ---------------------------
    const allowed = score > 0.55;

    return {
      allowed,
      score,
      breakdown: {
        estimatedSlippage,
        fillProbability,
        adverseSelection,
        latencyPenalty
      }
    };
  }
}

module.exports = ExecutionQualityEngine;
