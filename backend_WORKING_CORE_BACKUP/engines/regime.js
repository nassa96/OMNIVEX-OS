/**
 * MARKET REGIME DETECTOR V1
 * Converts micro-signals into macro market state
 */

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export function detectRegime({ momentum, volatility, orderBook }) {
  const imbalance = orderBook?.pressure?.imbalance || 0;

  const volScore = clamp(volatility / 50, 0, 1);
  const trendScore = clamp(momentum + imbalance, -1, 1);

  let regime = "RANGE_BOUND";

  /* =========================
     CHAOS FIRST (highest priority)
  ========================= */
  if (volScore > 0.8) {
    regime = "CHAOS_EVENT";
  }

  /* =========================
     HIGH VOLATILITY
  ========================= */
  else if (volScore > 0.5) {
    regime = "HIGH_VOLATILITY";
  }

  /* =========================
     TREND STATES
  ========================= */
  else if (trendScore > 0.25) {
    regime = "BULL_TREND";
  }

  else if (trendScore < -0.25) {
    regime = "BEAR_TREND";
  }

  return {
    type: "MARKET_REGIME",
    regime,
    metrics: {
      volatility: volScore,
      trend: trendScore,
      imbalance
    }
  };
}
