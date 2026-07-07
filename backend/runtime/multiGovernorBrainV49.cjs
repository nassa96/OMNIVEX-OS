const MultiGovernorV49 =
  require("../core/governor/multibrain/multiGovernorV49.cjs");

/**
 * SAINT V49 — WEIGHTED GOVERNOR BRAIN
 */

class MultiGovernorBrainV49 {

  constructor(governors, learningSystem) {
    this.engine = new MultiGovernorV49(governors, learningSystem);
  }

  decide(state) {
    return this.engine.decide(state);
  }
}

module.exports = MultiGovernorBrainV49;
