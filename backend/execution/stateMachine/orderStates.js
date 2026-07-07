/**
 * ORDER STATE DEFINITIONS
 * Deterministic lifecycle for all executions
 */

export const ORDER_STATES = {
  IDLE: "IDLE",
  SIGNAL: "SIGNAL",
  VALIDATED: "VALIDATED",
  RISK_APPROVED: "RISK_APPROVED",
  REJECTED: "REJECTED",
  EXECUTING: "EXECUTING",
  FILLED: "FILLED",
  SETTLED: "SETTLED",
  RECORDED: "RECORDED"
};

export const isTerminalState = (state) => {
  return ["REJECTED", "RECORDED"].includes(state);
};
