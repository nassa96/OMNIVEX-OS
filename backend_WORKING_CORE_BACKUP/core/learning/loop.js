/**
 * SELF-IMPROVEMENT LOOP
 * Reads Chronicle replay → adjusts agent weights
 */

function runLearning(chronicle, elohim) {
  const data = chronicle;

  if (!data || data.length < 10) return;

  let recent = data.slice(-50);

  let positive = 0;
  let negative = 0;

  for (const e of recent) {
    if ((e.pnl || 0) > 0) positive++;
    else negative++;
  }

  const rewardSignal = (positive - negative) / recent.length;

  // reinforce all agents based on system performance
  for (const agent of elohim.agents) {
    elohim.reinforce(agent, rewardSignal);
  }

  return {
    rewardSignal,
    updated: true
  };
}

module.exports = { runLearning };
