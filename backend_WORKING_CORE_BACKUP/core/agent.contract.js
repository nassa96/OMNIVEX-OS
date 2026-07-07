/**
 * OMNIVEX AGENT CONTRACT
 * ALL AGENTS MUST FOLLOW THIS INTERFACE
 */

function signal(context) {
  return {
    signal: "HOLD",   // BUY | SELL | HOLD
    strength: 0.5     // 0.0 - 1.0
  };
}

module.exports = {
  signal
};
