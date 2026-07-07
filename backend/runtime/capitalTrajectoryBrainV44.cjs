const CapitalTrajectoryV44 =
  require("../core/capital/memory/capitalTrajectoryV44.cjs");

/**
 * SAINT V44 — CAPITAL MEMORY BRAIN WRAPPER
 */

class CapitalTrajectoryBrainV44 {

  constructor() {
    this.engine = new CapitalTrajectoryV44();
  }

  record(state) {
    return this.engine.record(state);
  }

  analyze() {
    return this.engine.analyze();
  }

  forecast(capital, steps) {
    return this.engine.forecast(capital, steps);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = CapitalTrajectoryBrainV44;
