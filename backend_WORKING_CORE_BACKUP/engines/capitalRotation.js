/**
 * CAPITAL ROTATION ENGINE V1
 * Allocates exposure across assets based on risk + opportunity
 */

const STATE = {
  allocations: {
    BTC: 0.4,
    ETH: 0.4,
    SOL: 0.2
  }
};

export function rotateCapital(signals) {
  const adjusted = {};

  let totalScore = 0;

  for (const symbol of Object.keys(signals)) {
    const s = signals[symbol];

    const score =
      (1 - s.risk) +
      s.momentum +
      (s.memecoin?.spikeScore || 0);

    adjusted[symbol] = score;
    totalScore += score;
  }

  for (const symbol of Object.keys(adjusted)) {
    STATE.allocations[symbol] =
      adjusted[symbol] / totalScore;
  }

  return STATE.allocations;
}

export function getAllocations() {
  return STATE.allocations;
}
