const PredictionExecutionV36 =
  require("../core/execution/predictive/predictionExecutionV36.cjs");

/**
 * SAINT V36 — EXECUTION BRAIN WRAPPER
 */

class PredictionExecutionBrainV36 {

  constructor(routerBrain, predictionBrain) {
    this.engine =
      new PredictionExecutionV36(routerBrain, predictionBrain);
  }

  execute(order, context) {
    return this.engine.execute(order, context);
  }
}

module.exports = PredictionExecutionBrainV36;
