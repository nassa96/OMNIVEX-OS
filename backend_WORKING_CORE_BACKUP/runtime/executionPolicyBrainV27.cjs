const AdaptiveExecutionPolicyV27 =
  require("../core/policy/execution/adaptiveExecutionPolicyV27.cjs");

/**
 * SAINT V27 — POLICY BRAIN WRAPPER
 */

class ExecutionPolicyBrainV27 {

  constructor(memoryBrain) {
    this.engine = new AdaptiveExecutionPolicyV27(memoryBrain);
  }

  update() {
    return this.engine.updatePolicy();
  }

  apply(signal, context) {
    return this.engine.adaptSignal(signal, context);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = ExecutionPolicyBrainV27;
