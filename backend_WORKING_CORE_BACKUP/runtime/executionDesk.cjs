const ExecutionRouter = require("../core/execution/router/executionRouter.cjs");
const MultiExchangeExecutor = require("../core/execution/multivenue/multiExchangeExecutor.cjs");

/**
 * SAINT V13 — EXECUTION DESK
 * Orchestrates routing + multi-venue execution
 */

class ExecutionDesk {

  constructor() {

    this.router = new ExecutionRouter();
    this.executor = new MultiExchangeExecutor(this.router);
  }

  execute(signal, venues) {

    const result =
      this.executor.execute(signal, venues, 1);

    console.log("[V13 EXECUTION DESK RESULT]", result.summary);

    return result;
  }
}

module.exports = ExecutionDesk;
