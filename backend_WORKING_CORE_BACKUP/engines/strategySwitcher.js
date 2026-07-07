/**
 * STRATEGY ENGINE V2
 */

class StrategyEngine {
  run({ regime }) {
    switch (regime) {
      case "BULL_TREND":
        return { name: "momentum_breakout" };

      case "BEAR_TREND":
        return { name: "mean_reversion" };

      case "HIGH_VOLATILITY":
        return { name: "scalping" };

      case "CHAOS_EVENT":
        return { name: "risk_off" };

      default:
        return { name: "range_trading" };
    }
  }
}

export const strategy = new StrategyEngine();
