"use strict";

import prometheus from "../intelligence/prometheus/prometheus.js";
import auryn from "../intelligence/auryn/votingEngine.js";

export function evaluate(signal) {
  const scored = prometheus.score(signal);
  const decision = auryn.vote(scored);

  return {
    symbol: scored.symbol,
    decision: decision.decision,
    score: scored.score,
    confidence: scored.confidence,
    regime: scored.regime,
    microImpact: scored.microImpact,
    votes: decision.votes,
    ts: Date.now()
  };
}

export default { evaluate };
