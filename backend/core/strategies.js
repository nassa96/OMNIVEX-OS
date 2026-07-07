const STRATEGY_SET = [
  {
    name: "momentum_spike",
    weight: 1.0,
    minMove: 6,
  },
  {
    name: "mean_reversion",
    weight: 0.8,
    minMove: 4,
  },
  {
    name: "micro_breakout",
    weight: 0.9,
    minMove: 8,
  },
];

function scoreStrategy(strategy, tick, lastTick) {
  if (!lastTick) return 0;

  const move = tick.price - lastTick.price;
  const absMove = Math.abs(move);

  let score = 0;

  if (absMove >= strategy.minMove) {
    score += strategy.weight * (absMove / strategy.minMove);
  }

  return score;
}

function runStrategies(tick, lastTick) {
  let best = {
    signal: "HOLD",
    strength: 0.5,
    reason: "neutral market state",
  };

  let bestScore = 0;

  for (const strat of STRATEGY_SET) {
    const score = scoreStrategy(strat, tick, lastTick);

    if (score > bestScore) {
      bestScore = score;

      if (strat.name === "momentum_spike") {
        best = {
          signal: tick.price > (lastTick?.price || tick.price) ? "BUY" : "SELL",
          strength: Math.min(0.9, 0.5 + score / 10),
          reason: "momentum spike",
        };
      }

      if (strat.name === "mean_reversion") {
        best = {
          signal: "HOLD",
          strength: 0.5,
          reason: "mean reversion zone",
        };
      }

      if (strat.name === "micro_breakout") {
        best = {
          signal: "BUY",
          strength: Math.min(0.85, 0.5 + score / 12),
          reason: "breakout detected",
        };
      }
    }
  }

  return best;
}

function seedStrategies() {
  return STRATEGY_SET;
}

module.exports = {
  runStrategies,
  seedStrategies,
};
