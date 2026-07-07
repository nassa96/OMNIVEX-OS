import { executionQuality } from "../execution/fillMemory.js";

/**
 * SAINT v9 Learning Engine
 * Converts execution outcomes into adaptive signals
 */

let state = {
  aggression: 0.5,
  slippageTolerance: 1.0,
  confidenceBias: 1.0
};

/**
 * Update learning state based on execution performance
 */
function updateExecutionLearning() {
  const stats = executionQuality();

  // If slippage is high → reduce aggression
  if (stats.avgSlippage > 0.002) {
    state.aggression *= 0.95;
    state.slippageTolerance *= 0.9;
  }

  // If execution is clean → increase aggression slightly
  if (stats.avgSlippage < 0.0008) {
    state.aggression *= 1.02;
  }

  // Clamp values
  state.aggression = Math.min(1, Math.max(0.1, state.aggression));
  state.slippageTolerance = Math.min(2, Math.max(0.3, state.slippageTolerance));

  return state;
}

/**
 * Get current adaptive execution profile
 */
function getExecutionProfile() {
  return {
    ...state,
    stats: executionQuality()
  };
}

export {
  updateExecutionLearning,
  getExecutionProfile
};
