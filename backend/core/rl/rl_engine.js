/**
 * RL ENGINE (Step 4 Core)
 * Reward = equity delta smoothing
 */

let lastEquity = 1000;

function computeReward(prevEquity, currentEquity, drawdown) {
  const delta = currentEquity - prevEquity;

  // smooth reward signal (prevents overfitting noise)
  const reward =
    (delta * 0.8) +
    (drawdown * -10) +
    (Math.random() * 0.01);

  lastEquity = currentEquity;
  return reward;
}

/**
 * lightweight policy adapter
 */
function adjustPolicy(base, adaptationSignal) {
  return {
    aggression: base.aggression * adaptationSignal,
    risk: base.risk / adaptationSignal
  };
}

module.exports = {
  computeReward,
  adjustPolicy
};
