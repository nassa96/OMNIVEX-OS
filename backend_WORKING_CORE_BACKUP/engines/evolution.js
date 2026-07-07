/**
 * AGENT EVOLUTION V1
 * Adaptive weighting system (non-ML reinforcement biasing)
 */

const strategyWeights = {
  AGGRESSIVE_MOMENTUM: 1,
  DEFENSIVE_CAPITAL: 1,
  VOLATILITY_CUT: 1,
  MEAN_REVERSION: 1,
  KILL_SWITCH_MODE: 1
};

/* =========================
   UPDATE WEIGHTS
========================= */
export function evolveStrategy(strategy, score) {
  if (!strategy) return;

  const type = strategy.type || "MEAN_REVERSION";

  if (!strategyWeights[type]) {
    strategyWeights[type] = 1;
  }

  // reinforcement signal
  strategyWeights[type] += score * 0.01;

  // clamp to prevent runaway instability
  strategyWeights[type] = Math.max(
    0.1,
    Math.min(strategyWeights[type], 3)
  );

  return strategyWeights[type];
}

/* =========================
   GET WEIGHTS
========================= */
export function getStrategyWeights() {
  return strategyWeights;
}

/* =========================
   SELECT BEST STRATEGY OVERRIDE
========================= */
export function biasStrategy(selectedStrategy) {
  const type = selectedStrategy?.type;

  if (!type) return selectedStrategy;

  const weight = strategyWeights[type] || 1;

  return {
    ...selectedStrategy,
    adaptiveWeight: weight,
    bias:
      weight > 1.2
        ? "FAVOR"
        : weight < 0.8
        ? "AVOID"
        : "NEUTRAL"
  };
}
