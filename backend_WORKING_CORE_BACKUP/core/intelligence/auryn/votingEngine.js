"use strict";

import chronicle from "../../chronicle/ledger.js";

const STRATEGIES = {
  momentum: { weight: 0.35 },
  liquidity: { weight: 0.30 },
  regime: { weight: 0.25 },
  confidence: { weight: 0.10 }
};

function votes(s) {
  return {
    momentum: s.score > 0.6 ? 1 : s.score < -0.4 ? -1 : 0,
    liquidity: s.microImpact > 0.2 ? 1 : s.microImpact < -0.2 ? -1 : 0,
    regime:
      s.regime === "BULL_TREND" ? 1 :
      s.regime === "BEAR_TREND" ? -1 : 0,
    confidence: s.confidence > 0.7 ? 1 : 0
  };
}

export function vote(signal) {
  const v = votes(signal);

  const score =
    v.momentum * STRATEGIES.momentum.weight +
    v.liquidity * STRATEGIES.liquidity.weight +
    v.regime * STRATEGIES.regime.weight +
    v.confidence * STRATEGIES.confidence.weight;

  return {
    decision: score > 0.25 ? "BUY" : score < -0.25 ? "SELL" : "HOLD",
    score,
    votes: v,
    weights: STRATEGIES,
    ts: Date.now()
  };
}

export function feedback(entry) {
  chronicle.record(entry);

  const impact = entry.success ? 1 : -1;

  for (const k in STRATEGIES) {
    STRATEGIES[k].weight += impact * 0.01;
    STRATEGIES[k].weight = Math.max(0.05, Math.min(0.7, STRATEGIES[k].weight));
  }
}

export default { vote, feedback };
