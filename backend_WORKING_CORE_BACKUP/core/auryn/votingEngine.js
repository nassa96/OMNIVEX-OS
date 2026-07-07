"use strict";

import chronicle from "../chronicle/ledger.js";

/**
 * ==========================================
 * AURYN ADAPTIVE VOTING ENGINE v2
 * CHRONICLE-DRIVEN STRATEGY WEIGHTING
 * ==========================================
 */

let STATE = {
  cycle: 0,

  // learned strategy weights
  strategyWeights: {
    momentum: 1.0,
    volatility: 1.0,
    liquidity: 1.0,
    noise: 1.0
  }
};

/**
 * ==========================
 * STRATEGY VOTING CORE
 * ==========================
 */

function scoreOpportunity(opp) {
  const w = STATE.strategyWeights;

  return (
    opp.components?.momentum * w.momentum +
    opp.components?.volatility * w.volatility +
    opp.components?.liquidity * w.liquidity -
    opp.components?.noise * w.noise
  );
}

/**
 * ==========================
 * LEARNING FROM CHRONICLE
 * ==========================
 */

function updateStrategyWeights() {
  const stats = chronicle.getPerformanceStats();

  // If system is losing → reduce aggression signals
  if (stats.winRate < 0.45) {
    STATE.strategyWeights.momentum *= 0.97;
    STATE.strategyWeights.noise *= 1.03;
  }

  // If profitable → reinforce momentum strategies
  if (stats.pnl > 0) {
    STATE.strategyWeights.momentum *= 1.02;
  }

  // normalize stability (prevent runaway weights)
  const sum =
    STATE.strategyWeights.momentum +
    STATE.strategyWeights.volatility +
    STATE.strategyWeights.liquidity +
    STATE.strategyWeights.noise;

  for (const k in STATE.strategyWeights) {
    STATE.strategyWeights[k] /= sum;
  }
}

/**
 * ==========================
 * EVALUATE OPPORTUNITIES
 * ==========================
 */

export async function evaluate({ market, opportunities }) {
  STATE.cycle++;

  updateStrategyWeights();

  const votes = opportunities.map((opp) => {
    const score = scoreOpportunity(opp);

    return {
      symbol: opp.symbol,
      baseScore: opp.score,
      voteScore: score,
      confidence: opp.confidence,
      direction: opp.direction,
      weightProfile: { ...STATE.strategyWeights }
    };
  });

  return votes;
}

/**
 * ==========================
 * DECISION ENGINE
 * ==========================
 */

export function decide(votes) {
  if (!votes || votes.length === 0) {
    return { action: "HOLD", confidence: 0 };
  }

  const best = votes.reduce((a, b) =>
    Math.abs(b.voteScore) > Math.abs(a.voteScore) ? b : a
  );

  const action =
    best.voteScore > 0.25 ? "BUY" :
    best.voteScore < -0.25 ? "SELL" :
    "HOLD";

  return {
    action,
    confidence: Math.abs(best.voteScore),
    selected: best
  };
}

/**
 * ==========================
 * FEEDBACK HOOK (OPTIONAL EXTERNAL)
 * ==========================
 */

export function feedback(entry) {
  // reserved for future reinforcement tuning
}

export default {
  evaluate,
  decide,
  feedback
};
