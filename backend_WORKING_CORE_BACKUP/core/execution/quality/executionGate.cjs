const ExecutionQualityEngine = require("./executionQualityEngine.cjs");

/**
 * SAINT V10 — EXECUTION GATE
 * Blocks untradable signals before they hit execution layer
 */

class ExecutionGate {

  constructor() {
    this.engine = new ExecutionQualityEngine();
  }

  validate(signal, market, liquidity) {

    const result =
      this.engine.evaluate(signal, market, liquidity);

    if (!result.allowed) {

      return {
        status: "BLOCKED",
        reason: "POOR_EXECUTION_QUALITY",
        ...result
      };
    }

    return {
      status: "ALLOWED",
      ...result
    };
  }
}

module.exports = ExecutionGate;
