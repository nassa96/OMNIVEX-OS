/**
 * SAINT V90 — EVOLUTION ENGINE
 */

class EvolutionEngineV90 {

  constructor(strategyLab) {
    this.lab = strategyLab;
  }

  evolve(strategyName) {

    const mutated = this.lab.mutate(strategyName);

    if (!mutated) {
      return { error: "NO_STRATEGY" };
    }

    return {
      strategy: mutated,
      evolved: true,
      ts: Date.now()
    };
  }
}

module.exports = EvolutionEngineV90;
