/**
 * SAINT V5 — TOXIC FLOW DETECTION ENGINE
 * --------------------------------------
 * Filters fake liquidity + manipulative orderbook behavior
 */

class ToxicFlowEngine {

  constructor() {}

  // ---------------------------
  // MAIN TOXICITY SCORE
  // ---------------------------
  analyze(fusedBook) {

    const depth = fusedBook.depth || {};
    const spread = fusedBook.spread || {};

    let toxicity = 0;

    // ---------------------------
    // 1. LIQUIDITY IMBALANCE SPIKES
    // ---------------------------
    const imbalance = depth.imbalance || 0;
    const total = depth.totalDepth || 1;

    const imbalanceRatio = imbalance / total;

    if (imbalanceRatio > 0.4) {
      toxicity += 0.3;
    }

    // ---------------------------
    // 2. THIN BOOK INSTABILITY
    // ---------------------------
    if (depth.totalDepth < 5000) {
      toxicity += 0.2;
    }

    // ---------------------------
    // 3. SPREAD DISTORTION
    // ---------------------------
    const spreadRatio =
      (spread.spread || 0) / ((spread.mid || 1) + 1);

    if (spreadRatio > 0.002) {
      toxicity += 0.2;
    }

    // ---------------------------
    // 4. ARTIFICIAL LIQUIDITY DETECTION
    // (simple heuristic: extreme imbalance + low depth)
    // ---------------------------
    if (imbalanceRatio > 0.5 && depth.totalDepth < 8000) {
      toxicity += 0.3;
    }

    // ---------------------------
    // FINAL NORMALIZATION
    // ---------------------------
    toxicity = Math.min(1, toxicity);

    return {
      toxicity,
      state:
        toxicity > 0.7 ? "HIGHLY_TOXIC" :
        toxicity > 0.4 ? "MODERATE" :
        "CLEAN"
    };
  }
}

module.exports = ToxicFlowEngine;
