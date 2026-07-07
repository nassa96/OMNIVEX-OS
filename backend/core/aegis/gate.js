/**
 * =========================================================
 * AEGIS V3 — ADAPTIVE EXECUTION GATE (REAL LOGIC)
 * =========================================================
 * Features:
 * - execution gating (not binary spam block)
 * - rolling confidence memory
 * - risk pressure adjustment
 * - duplicate smoothing (not hard block)
 * - adaptive threshold drift
 * =========================================================
 */

const state = {
  lastSignalKey: null,
  lastTickTime: 0,

  // adaptive memory (REAL learning signal)
  confidenceHistory: [],
  riskPressure: 1.0,
  driftThreshold: 0.75
};

/**
 * small moving average helper
 */
function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * build signal fingerprint (prevents spam collapse)
 */
function fingerprint(signal, tick) {
  return `${signal.signal}:${Math.floor(tick.price / 10)}`;
}

/**
 * =========================================================
 * MAIN GATE LOGIC
 * =========================================================
 */

function evaluate(signal, tick) {
  const now = Date.now();

  if (!signal || !tick) {
    return {
      allowed: false,
      score: 0,
      reason: "INVALID_INPUT"
    };
  }

  const key = fingerprint(signal, tick);

  // ---------------------------------------------------------
  // 1. DUPLICATE SENSING (SOFT PENALTY, NOT BLOCK)
  // ---------------------------------------------------------

  let duplicatePenalty = 1.0;

  if (state.lastSignalKey === key) {
    duplicatePenalty = 0.65; // soften repetition instead of blocking
  }

  state.lastSignalKey = key;

  // ---------------------------------------------------------
  // 2. BASE CONFIDENCE SCORE
  // ---------------------------------------------------------

  let score = signal.strength || 0.5;

  // ---------------------------------------------------------
  // 3. RISK PRESSURE ADAPTATION
  // ---------------------------------------------------------

  const volatility = Math.abs(tick.price % 7) / 10;
  state.riskPressure = 0.7 + volatility;

  score = score * duplicatePenalty * state.riskPressure;

  // ---------------------------------------------------------
  // 4. MEMORY BUFFER (REAL LEARNING SIGNAL)
  // ---------------------------------------------------------

  state.confidenceHistory.push(score);

  if (state.confidenceHistory.length > 20) {
    state.confidenceHistory.shift();
  }

  const movingAvg = avg(state.confidenceHistory);

  // drift threshold adapts slowly
  state.driftThreshold = 0.72 + (movingAvg * 0.1);

  // ---------------------------------------------------------
  // 5. EXECUTION DECISION
  // ---------------------------------------------------------

  let allowed = false;
  let reason = "BLOCKED";

  if (score >= state.driftThreshold) {
    allowed = true;
    reason = "EXECUTED";
  } else if (score >= state.driftThreshold * 0.85) {
    allowed = true;
    reason = "SOFT_EXECUTION";
  } else {
    allowed = false;
    reason = "LOW_CONFIDENCE";
  }

  return {
    allowed,
    score: Number(score.toFixed(4)),
    reason,
    driftThreshold: Number(state.driftThreshold.toFixed(4)),
    riskPressure: Number(state.riskPressure.toFixed(4)),
    movingAvg: Number(movingAvg.toFixed(4))
  };
}

module.exports = {
  evaluate
};
