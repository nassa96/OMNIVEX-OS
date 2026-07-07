/**
 * =========================================================
 * CHRONICLE RL CORE
 * Lightweight reinforcement memory + reward engine
 * =========================================================
 */

// in-memory replay buffer (temporary until SQLite upgrade)
let memory = [];

// baseline equity tracker for reward delta calculation
let lastEquity = 1000;

/**
 * Compute reinforcement reward
 * reward = equity delta (smoothed) - risk penalty
 */
function computeReward(currentEquity, drawdown = 0) {
  const delta = currentEquity - lastEquity;

  // smooth reward signal (reduces noise spikes)
  const baseReward = delta * 0.7;

  // risk penalty (encourages stability)
  const riskPenalty = drawdown * 2;

  const reward = baseReward - riskPenalty;

  lastEquity = currentEquity;

  return reward;
}

/**
 * Record full system state into replay memory
 */
function record(event) {
  memory.push({
    ts: Date.now(),
    ...event
  });

  // prevent memory overflow (Termux safe limit)
  if (memory.length > 5000) {
    memory.shift();
  }
}

/**
 * Return full replay buffer
 */
function getMemory() {
  return memory;
}

/**
 * Reset RL memory (debug / recovery)
 */
function reset() {
  memory = [];
  lastEquity = 1000;
}

module.exports = {
  computeReward,
  record,
  getMemory,
  reset
};
