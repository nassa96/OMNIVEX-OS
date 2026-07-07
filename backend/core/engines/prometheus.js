"use strict";

/**
 * PROMETHEUS OPPORTUNITY ENGINE
 * --------------------------------
 * Converts raw market + signals into ranked trade opportunities
 * before Auryn makes decisions.
 */

function scoreMomentum(market, signals) {
  const price = market?.price || 0;
  const strength = signals?.sophia?.strength || 0.5;

  return strength * 0.6 + (market?.trend || 0.5) * 0.4;
}

function scoreVolatility(signals) {
  const v = signals?.cerberus?.volatility || 0.5;

  // Sweet spot: not too low, not too high
  return 1 - Math.abs(v - 0.55) * 1.8;
}

function scoreLiquidity(market) {
  return market?.liquidity || 0.5;
}

function detectRegime(market, signals) {
  const v = signals?.cerberus?.volatility || 0.5;

  if (v > 0.75) return "EXPANSION";
  if (v < 0.35) return "COMPRESSION";
  return "MID_RANGE";
}

function generateOpportunities({ market, signals, risk }) {
  const regime = detectRegime(market, signals);

  const momentum = scoreMomentum(market, signals);
  const volatilityScore = scoreVolatility(signals);
  const liquidity = scoreLiquidity(market);

  const baseScore =
    momentum * 0.45 +
    volatilityScore * 0.35 +
    liquidity * 0.2;

  const opportunities = [];

  // LONG setup
  if (baseScore > 0.65 && regime !== "COMPRESSION") {
    opportunities.push({
      id: `LONG_${Date.now()}`,
      type: "LONG",
      score: baseScore,
      confidence: momentum,
      regime,
      reason: "Momentum + liquidity alignment",
      expectedMove: "UP",
      riskTier: risk?.level || "MED"
    });
  }

  // SHORT setup
  if (signals?.cerberus?.volatility > 0.7 && baseScore > 0.6) {
    opportunities.push({
      id: `SHORT_${Date.now()}`,
      type: "SHORT",
      score: baseScore * 0.95,
      confidence: volatilityScore,
      regime,
      reason: "Volatility expansion reversal window",
      expectedMove: "DOWN",
      riskTier: risk?.level || "MED"
    });
  }

  // SCALP setup
  if (regime === "MID_RANGE" && baseScore > 0.55) {
    opportunities.push({
      id: `SCALP_${Date.now()}`,
      type: "SCALP",
      score: baseScore * 0.9,
      confidence: liquidity,
      regime,
      reason: "Range-bound micro inefficiency",
      expectedMove: "BOTH",
      riskTier: "LOW"
    });
  }

  return {
    regime,
    score: baseScore,
    opportunities: opportunities.sort((a, b) => b.score - a.score)
  };
}

module.exports = {
  generateOpportunities
};
