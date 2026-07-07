const ExecutionMemory = require("../core/v26/execution_memory.cjs");

const memory = new ExecutionMemory();

/**
 * Attach AFTER execution
 */
function recordExecution(cognition, execution, market) {

  const record = memory.record({
    cognition,
    execution,
    market
  });

  const feedback = memory.feedbackSignal();

  return {
    record,
    feedback,
    regime: feedback.regime
  };
}

module.exports = recordExecution;
