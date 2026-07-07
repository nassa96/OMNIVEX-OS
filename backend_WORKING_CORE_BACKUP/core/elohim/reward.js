/**
 * =========================================================
 * REAL REINFORCEMENT SIGNAL ENGINE
 * PnL-BASED REWARD SYSTEM
 * =========================================================
 */

const CHRONICLE = require("../chronicle/db");

/**
 * simple position simulator
 */
function computePnL(entry, nextTick) {
  if (!entry || !nextTick) return 0;

  const priceDiff = nextTick.price - entry.tick.price;

  if (entry.fusedSignal.signal === "BUY") return priceDiff;
  if (entry.fusedSignal.signal === "SELL") return -priceDiff;

  return 0;
}

/**
 * assign rewards to past decisions
 */
function computeRewards() {
  const data = CHRONICLE.tail(200);

  const rewards = {
    SOPHIA: 0,
    FORGE: 0
  };

  for (let i = 0; i < data.length - 1; i++) {
    const entry = data[i];
    const next = data[i + 1];

    const pnl = computePnL(entry, next);

    const agents = entry.fusedSignal?.agents || [];

    for (const a of agents) {
      rewards[a] += pnl;
    }
  }

  return rewards;
}

module.exports = {
  computeRewards
};
