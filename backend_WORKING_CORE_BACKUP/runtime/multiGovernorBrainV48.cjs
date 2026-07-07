const MultiGovernorV48 =
  require("../core/governor/multibrain/multiGovernorV48.cjs");

/**
 * SAINT V48 — MULTI-GOVERNOR BRAIN WRAPPER
 */

class MultiGovernorBrainV48 {

  constructor(governors) {
    this.engine = new MultiGovernorV48(governors);
  }

  decide(state) {
    return this.engine.decide(state);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = MultiGovernorBrainV48;
