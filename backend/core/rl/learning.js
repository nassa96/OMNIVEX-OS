/**
 * =========================================================
 * RL LOOP V1 — CHRONICLE DRIVEN BEHAVIOR ADAPTATION
 * =========================================================
 */

const CHRONICLE = require("../chronicle");

let bias = {
  buy: 1,
  sell: 1,
  hold: 1
};

function updateLearning() {
  const replay = CHRONICLE.getEvents(300);

  let wins = 0;
  let losses = 0;

  let buyPnL = 0;
  let sellPnL = 0;

  for (const e of replay) {
    if (!e.pnl) continue;

    if (e.pnl > 0) wins++;
    else losses++;

    if (e.signal?.signal === "BUY") buyPnL += e.pnl;
    if (e.signal?.signal === "SELL") sellPnL += e.pnl;
  }

  const total = Math.max(1, wins + losses);

  const winRate = wins / total;

  // adaptive bias update
  bias.buy = 1 + (buyPnL / 1000);
  bias.sell = 1 + (sellPnL / 1000);
  bias.hold = 1 + (winRate - 0.5);

  return {
    winRate,
    bias
  };
}

function getBias() {
  return bias;
}

module.exports = {
  updateLearning,
  getBias
};
