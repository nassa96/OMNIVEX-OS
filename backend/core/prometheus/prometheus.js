"use strict";

import chronicle from "../chronicle/ledger.js";

/**
 * ==========================================
 * PROMETHEUS v3
 * ADAPTIVE SCORING ENGINE
 * (Chronicle-Driven Learning Loop)
 * ==========================================
 */

let STATE = {
  cycle: 0,

  // adaptive weights (learned over time)
  weights: {
    momentum: 0.40,
    volatility: 0.25,
    liquidity: 0.25,
    noise: 0.20
  }
};

/**
 * ==========================
 * BASE SIGNALS
 * ==========================
 */

function volatilityScore(m) {
  return Math.min(1, m?.volatility || 0.5);
}

function momentumScore(m) {
  return Math.tanh((m?.change || 0) * 5);
}

function liquidityScore(m) {
  return Math.min(1, (m?.volume || 1) / 1000);
}

function noisePenalty(m) {
  return Math.min(1, (m?.spread || 0) * 10);
}

/**
 * ==========================
 * LEARNING UPDATE STEP
 * ==========================
 */
function updateWeightsFromChronicle() {
  const stats = chronicle.getPerformanceStats();

  // If losing, reduce aggression
  if (stats.winRate < 0.45) {
    STATE.weights.momentum *= 0.98;
    STATE.weights.volatility *= 0.99;
    STATE.weights.noise *= 1.02;
  }

  // If profitable, increase confidence in momentum
  if (stats.pnl > 0) {
    STATE.weights.momentum *= 1.01;
  }

  // normalize
  const sum =
    STATE.weights.momentum +
    STATE.weights.volatility +
    STATE.weights.liquidity;

  STATE.weights.momentum /= sum;
  STATE.weights.volatility /= sum;
  STATE.weights.liquidity /= sum;
}

/**
 * ==========================
 * MAIN GENERATION ENGINE
 * ==========================
 */

export function generate({ market }) {
  STATE.cycle++;

  // LEARN BEFORE SCORING
  updateWeightsFromChronicle();

  const mom = momentumScore(market);
  const vol = volatilityScore(market);
  const liq = liquidityScore(market);
  const noise = noisePenalty(market);

  let score =
    (mom * STATE.weights.momentum) +
    (vol * STATE.weights.volatility) +
    (liq * STATE.weights.liquidity) -
    (noise * STATE.weights.noise);

  score = Math.max(-1, Math.min(1, score));

  const direction =
    score > 0.2 ? "LONG" :
    score < -0.2 ? "SHORT" :
    "NEUTRAL";

  return {
    cycle: STATE.cycle,
    opportunities: [{
      symbol: market.symbol,
      price: market.price,
      score,
      confidence: Math.abs(score),
      direction,
      weights: { ...STATE.weights }
    }]
  };
}

export function feedback(entry) {
  // optional external feedback hook
}

export default {
  generate,
  feedback
};
