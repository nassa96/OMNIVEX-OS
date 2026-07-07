const ExecutionCognitionEngine =
  require("../core/execution/v25/executionCognitionEngine.cjs");

/**
 * SAINT V25 — EXECUTION BRAIN WRAPPER
 */

class ExecutionBrainV25 {

  constructor() {
    this.engine = new ExecutionCognitionEngine();
  }

  start(tradeId, context) {
    this.engine.startTrade(tradeId, context);
  }

  fill(tradeId, fill) {
    return this.engine.updateFill(tradeId, fill);
  }

  adapt(tradeId, marketContext) {
    return this.engine.adapt(tradeId, marketContext);
  }

  snapshot(tradeId) {
    return this.engine.snapshot(tradeId);
  }
}

module.exports = ExecutionBrainV25;
