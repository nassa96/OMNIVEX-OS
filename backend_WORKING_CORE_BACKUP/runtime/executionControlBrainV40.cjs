const ExecutionControlV40 =
  require("../core/control/adversarial/executionControlV40.cjs");

/**
 * SAINT V40 — EXECUTION CONTROL BRAIN WRAPPER
 */

class ExecutionControlBrainV40 {

  constructor(routerBrain, adversarialBrain) {
    this.engine =
      new ExecutionControlV40(routerBrain, adversarialBrain);
  }

  execute(order, context) {
    return this.engine.execute(order, context);
  }
}

module.exports = ExecutionControlBrainV40;
