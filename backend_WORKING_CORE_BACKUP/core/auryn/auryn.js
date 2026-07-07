/**
 * =========================================
 * SAINT AURYN v1
 * Strategic Orchestration Layer
 * =========================================
 */

let STATE_REF = null;

function attachKernel(state) {
  STATE_REF = state;
}

/**
 * =========================
 * REGIME DETECTION
 * =========================
 */
function detectRegime() {
  if (!STATE_REF || !STATE_REF.lastSignal) {
    return "BOOT";
  }

  const s = STATE_REF.lastSignal.signal;
  const strength = STATE_REF.lastSignal.strength || 0;

  if (s === "BUY" && strength > 0.65) return "BULL";
  if (s === "SELL" && strength > 0.65) return "BEAR";

  return "CHOP";
}

/**
 * =========================
 * STRATEGY ENGINE
 * =========================
 */
function getStrategy() {
  const regime = detectRegime();

  switch (regime) {
    case "BULL":
      return {
        mode: "AGGRESSIVE",
        risk: "MEDIUM",
        positionBias: "LONG",
        sensitivity: 1.2
      };

    case "BEAR":
      return {
        mode: "DEFENSIVE",
        risk: "LOW",
        positionBias: "SHORT",
        sensitivity: 0.6
      };

    case "CHOP":
      return {
        mode: "PAPER",
        risk: "LOW",
        positionBias: "NEUTRAL",
        sensitivity: 0.8
      };

    default:
      return {
        mode: "BOOT",
        risk: "LOW",
        positionBias: "NEUTRAL",
        sensitivity: 0.5
      };
  }
}

module.exports = {
  attachKernel,
  detectRegime,
  getStrategy
};
