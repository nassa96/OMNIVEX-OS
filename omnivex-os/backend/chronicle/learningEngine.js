const memory = [];

function record(event) {
  memory.push(event);

  if (memory.length > 5000) {
    memory.shift();
  }
}

/**
 * Extract simple behavioral learning signals
 */
function analyzeMemory() {
  const executions = memory.filter(e => e.type === "saint.execution");
  const wins = executions.filter(e => (e.pnl || 0) > 0);
  const losses = executions.filter(e => (e.pnl || 0) <= 0);

  const winRate = executions.length
    ? wins.length / executions.length
    : 0;

  const avgConfidence =
    executions.reduce((sum, e) => sum + (e.confidence || 0), 0) /
    (executions.length || 1);

  return {
    totalExecutions: executions.length,
    winRate,
    avgConfidence,
    bias: winRate > 0.55 ? "OVERTAKE" : "CONSERVE"
  };
}

/**
 * Feedback signal for SOPHIA
 */
function getLearningBias() {
  const analysis = analyzeMemory();

  if (analysis.bias === "OVERTAKE") {
    return {
      confidenceBoost: 0.05,
      riskTolerance: 1.1
    };
  }

  return {
    confidenceBoost: -0.03,
    riskTolerance: 0.85
  };
}

function getMemory() {
  return memory;
}

module.exports = {
  record,
  analyzeMemory,
  getLearningBias,
  getMemory
};
