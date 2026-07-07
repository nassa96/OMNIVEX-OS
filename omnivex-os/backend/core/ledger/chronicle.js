export const ledger = {
  positions: {},
  executions: [],
  realizedPnL: 0
};

export function recordExecution(execution) {
  ledger.executions.unshift(execution);

  if (ledger.executions.length > 100) {
    ledger.executions.length = 100;
  }

  return ledger;
}
