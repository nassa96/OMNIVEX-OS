const ExecutionCognition = require("../core/v25/execution_cognition.cjs");

const cognition = new ExecutionCognition();

function processTick(signal, market, riskGate, executor) {

  const cognitionResult = cognition.evaluate(signal, market);

  if (cognitionResult.decision === "BLOCK") {
    return { status: "BLOCKED", reason: "execution_cognition" };
  }

  if (cognitionResult.decision === "WAIT") {
    return { status: "DEFERRED", reason: "adverse_selection" };
  }

  const finalDecision =
    cognitionResult.decision === "REDUCE_SIZE"
      ? { ...signal, sizeMultiplier: 0.5 }
      : signal;

  const execution = executor.execute(finalDecision, market);

  return {
    cognition: cognitionResult,
    execution
  };
}

module.exports = processTick;
