const CHRONICLE = require("../chronicle/db");
const REWARD = require("./reward");

const WEIGHTS = {
  SOPHIA: 1.0,
  FORGE: 1.0
};

function getWeights() {
  return WEIGHTS;
}

function learn() {
  const rewards = REWARD.computeRewards();

  const total =
    Math.abs(rewards.SOPHIA) + Math.abs(rewards.FORGE) || 1;

  const normS = rewards.SOPHIA / total;
  const normF = rewards.FORGE / total;

  // gradient update (profit-driven)
  WEIGHTS.SOPHIA += normS * 0.1;
  WEIGHTS.FORGE += normF * 0.1;

  // clamp stability
  WEIGHTS.SOPHIA = Math.max(0.2, Math.min(3, WEIGHTS.SOPHIA));
  WEIGHTS.FORGE = Math.max(0.2, Math.min(3, WEIGHTS.FORGE));

  return {
    rewards,
    weights: WEIGHTS
  };
}

module.exports = {
  learn,
  getWeights
};
