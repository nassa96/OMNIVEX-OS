/**
 * SAINT V60.1 — STRATEGY MUTATION ENGINE
 */

class StrategyMutationEngineV60_1 {

  constructor() {
    this.weights = {
      TREND: 1.0,
      MEAN_REVERSION: 1.0,
      ARB: 1.0,
      DEFENSIVE: 1.0
    };

    this.performance = {};
  }

  log(strategy, pnl) {

    if (!this.performance[strategy]) {
      this.performance[strategy] = [];
    }

    this.performance[strategy].push(pnl);

    if (this.performance[strategy].length > 100) {
      this.performance[strategy].shift();
    }
  }

  mutate() {

    for (const strat in this.performance) {

      const history = this.performance[strat];
      const avg = history.reduce((a, b) => a + b, 0) / history.length;

      if (avg > 0) {
        this.weights[strat] *= 1.05;
      } else {
        this.weights[strat] *= 0.95;
      }

      this.weights[strat] = Math.max(0.1, Math.min(3.0, this.weights[strat]));
    }

    return this.weights;
  }

  getWeight(strategy) {
    return this.weights[strategy] || 1.0;
  }
}

module.exports = StrategyMutationEngineV60_1;
