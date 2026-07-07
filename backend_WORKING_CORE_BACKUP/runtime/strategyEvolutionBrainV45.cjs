const StrategyEvolutionV45 =
  require("../core/evolution/strategy/strategyEvolutionV45.cjs");

/**
 * SAINT V45 — STRATEGY EVOLUTION BRAIN WRAPPER
 */

class StrategyEvolutionBrainV45 {

  constructor() {
    this.engine = new StrategyEvolutionV45();
  }

  register(name, config) {
    this.engine.register(name, config);
  }

  recordPerformance(name, metrics) {
    this.engine.recordPerformance(name, metrics);
  }

  evolve() {
    return this.engine.evolve();
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = StrategyEvolutionBrainV45;
