/**
 * OMNIVEX STATE AUTHORITY LAYER
 * SINGLE SOURCE OF TRUTH
 */

const STATE = {
  system: "OMNIVEX_LOCKED",
  ticks: 0,

  lastTick: null,
  lastSignal: null,
  lastRegime: null,
  lastDecision: null,

  equity: 1000,
  pnl: 0
};

function updateState(update) {
  Object.assign(STATE, update);
}

module.exports = {
  STATE,
  updateState
};
