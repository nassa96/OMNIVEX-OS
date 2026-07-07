const ExecutionGate = require("../core/execution/quality/executionGate.cjs");

class ExecutionPipeline {

  constructor() {
    this.gate = new ExecutionGate();
  }

  process(signal, market, liquidity) {

    const verdict =
      this.gate.validate(signal, market, liquidity);

    if (verdict.status === "BLOCKED") {

      console.log("[V10 EXECUTION BLOCK]", verdict);

      return {
        action: "SKIP",
        reason: verdict.reason
      };
    }

    console.log("[V10 EXECUTION APPROVED]", verdict);

    return {
      action: "EXECUTE",
      score: verdict.score
    };
  }
}

module.exports = ExecutionPipeline;
