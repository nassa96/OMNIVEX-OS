const SmartExecutionRouterV22 = require("../core/execution/v22/smartExecutionRouterV22.cjs");

/**
 * SAINT V22 — EXECUTION BRAIN WRAPPER
 */

class ExecutionBrainV22 {

  constructor(aegis) {
    this.router = new SmartExecutionRouterV22(aegis);
  }

  decide(context) {
    return this.router.decide(context);
  }
}

module.exports = ExecutionBrainV22;
