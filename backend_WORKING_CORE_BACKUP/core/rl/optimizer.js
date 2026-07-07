/**
 * =========================================
 * OMNIVEX RL OPTIMIZER V1
 * Chronicle-driven adaptive learning engine
 * =========================================
 */

const CHRONICLE = require("../chronicle");

const state = {
  window: 50,
  learningRate: 0.05,

  weights: {
    SOPHIA: 1.0,
    FORGE: 1.0
  }
};

// =========================================================
// FETCH RECENT PERFORMANCE
// =========================================================

function computePerformance(events) {
  let pnl = 0;

  for (const e of events) {
    pnl += e.pnl || 0;
  }

  return pnl;
}

// =========================================================
// ADJUST WEIGHTS BASED ON PERFORMANCE CONTRIBUTION
// =========================================================

function updateWeights() {
  const events = CHRONICLE.getEvents(state.window);

  if (!events.length) return state.weights;

  const pnl = computePerformance(events);

  // baseline stability factor (prevents overreaction)
  const stability = Math.tanh(pnl / 1000);

  // adjust weights slowly and safely
  if (pnl > 0) {
    state.weights.SOPHIA += state.learningRate * stability;
    state.weights.FORGE += state.learningRate * (1 - stability);
  } else {
    state.weights.SOPHIA -= state.learningRate * 0.5;
    state.weights.FORGE -= state.learningRate * 0.5;
  }

  // clamp
  state.weights.SOPHIA = Math.max(0.2, Math.min(3, state.weights.SOPHIA));
  state.weights.FORGE = Math.max(0.2, Math.min(3, state.weights.FORGE));

  return state.weights;
}

// =========================================================
// GET CURRENT WEIGHTS
// =========================================================

function getWeights() {
  return state.weights;
}

module.exports = {
  updateWeights,
  getWeights
};
