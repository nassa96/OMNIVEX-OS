/**
 * SAINT V90 — STRATEGY LAB
 * Controlled strategy mutation system
 */

class StrategyLabV90 {

  constructor() {
    this.strategies = new Map();
  }

  register(name, strategy) {
    this.strategies.set(name, strategy);
  }

  mutate(name) {

    const base = this.strategies.get(name);

    if (!base) return null;

    const mutated = {
      ...base,
      aggressiveness: Math.max(0, Math.min(1, base.aggressiveness + (Math.random() - 0.5) * 0.1))
    };

    return mutated;
  }
}

module.exports = StrategyLabV90;
