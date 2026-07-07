/**
 * =========================================
 * SWARM SELF-LEARNING LOOP V1
 * Chronicle → Behavior Adaptation
 * =========================================
 */

const CHRONICLE = require("../chronicle");
const RL = require("../rl/learning");

let agentWeights = {
  sophia: 1.0,
  forge: 1.0
};

function updateSwarm() {
  const replay = CHRONICLE.getEvents(250);

  let sophiaPnL = 0;
  let forgePnL = 0;

  for (const e of replay) {
    if (!e.pnl) continue;

    if (e.signal?.source === "SOPHIA") {
      sophiaPnL += e.pnl;
    }

    if (e.signal?.source === "FORGE") {
      forgePnL += e.pnl;
    }
  }

  // normalize
  agentWeights.sophia = 1 + sophiaPnL / 2000;
  agentWeights.forge = 1 + forgePnL / 2000;

  // clamp (prevents instability)
  agentWeights.sophia = Math.max(0.5, Math.min(1.5, agentWeights.sophia));
  agentWeights.forge = Math.max(0.5, Math.min(1.5, agentWeights.forge));

  return {
    agentWeights
  };
}

function getWeights() {
  return agentWeights;
}

module.exports = {
  updateSwarm,
  getWeights
};
