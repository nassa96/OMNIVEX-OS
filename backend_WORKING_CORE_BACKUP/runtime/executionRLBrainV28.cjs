const ExecutionRLV28 =
  require("../core/rl/execution/executionRLV28.cjs");

/**
 * SAINT V28 — RL BRAIN WRAPPER
 */

class ExecutionRLBrainV28 {

  constructor() {
    this.engine = new ExecutionRLV28();
  }

  learn(execution) {
    return this.engine.evaluate(execution);
  }

  update() {
    return this.engine.updatePolicy();
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = ExecutionRLBrainV28;
