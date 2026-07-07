"use strict";

/**
 * AURYN v3 — SELF-ADAPTIVE DECISION ENGINE
 * ----------------------------------------
 * Now incorporates:
 *  - Chronicle reward feedback
 *  - Dynamic weight shifting
 *  - Regime-aware adaptation
 */

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

// ===============================
// BASE WEIGHTS (CAN EVOLVE)
// ===============================
const BASE = {
  opportunity: 0.45,
  momentum: 0.25,
  risk: 0.2,
  regime: 0.1
};

// ===============================
// ADAPTIVE WEIGHT SHIFT
// ===============================
function adaptWeights(avgReward) {
  let w = { ...BASE };

  // If system is performing well → trust opportunity engine more
  if (avgReward > 0.2) {
    w.opportunity += 0.05;
    w.momentum -= 0.03;
    w.risk -= 0.02;
  }

  // If system is underperforming → become more conservative
  if (avgReward < 0) {
    w.risk += 0.1;
    w.opportunity -= 0.05;
    w.momentum += 0.05;
  }

  // Normalize drift
  const sum = Object.values(w).reduce((a, b) => a + b, 0);
  Object.keys(w).forEach(k => (w[k] = w[k] / sum));

  return w;
}

// ===============================
// OPPORTUNITY SCORE
// ===============================
function scoreOpportunity(opportunityPack) {
  if (!opportunityPack?.opportunities?.length) return 0.5;

  const top = opportunityPack.opportunities[0];
  return clamp(top.score || 0.5, 0, 1);
}

// ===============================
// RISK FILTER
// ===============================
function riskFilter(risk) {
  if (!risk?.approved) return 0;

  const r = risk?.riskScore ?? 0.5;
  return 1 - r;
}

// ===============================
// REGIME BIAS
// ===============================
function regimeBias(regime) {
  switch (regime) {
    case "EXPANSION":
      return 0.15;
    case "COMPRESSION":
      return -0.15;
    default:
      return 0;
  }
}

// ===============================
// DECISION ENGINE
// ===============================
function decide({
  market,
  signals,
  opportunities,
  risk,
  warMode,
  avgReward = 0
}) {
  const weights = adaptWeights(avgReward);

  const oppScore = scoreOpportunity(opportunities);
  const riskScore = riskFilter(risk);
  const regime = opportunities?.regime || "UNKNOWN";

  const bias = regimeBias(regime);

  const momentum = signals?.sophia?.strength || 0.5;
  const volatility = signals?.cerberus?.volatility || 0.5;

  // ===============================
  // CORE ADAPTIVE SCORE
  // ===============================
  let score =
    oppScore * weights.opportunity +
    momentum * weights.momentum +
    riskScore * weights.risk +
    bias * weights.regime;

  // WAR MODE BOOST (controlled aggression)
  if (warMode) score += 0.05;

  score = clamp(score, 0, 1);

  // ===============================
  // ACTION POLICY
  // ===============================
  let action = "HOLD";
  let confidence = score;

  if (score > 0.72 && volatility < 0.85) {
    action = "BUY";
  } else if (score < 0.33) {
    action = "SELL";
  }

  // ===============================
  // POSITION INTENSITY
  // ===============================
  let intensity = 0;

  if (action === "BUY") intensity = clamp(score * 1.3, 0, 1);
  if (action === "SELL") intensity = clamp((1 - score) * 1.2, 0, 1);

  return {
    action,
    confidence,
    intensity,
    score,
    regime,
    weights,
    avgRewardImpact: avgReward,
    source: "AURYN_SELF_ADAPTIVE_V3"
  };
}

module.exports = {
  decide
};
