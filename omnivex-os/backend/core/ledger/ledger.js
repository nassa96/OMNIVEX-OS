export const ledger = {
  positions: {
    "BTC-USD": {
      size: 0,
      avgPrice: 0,
      costBasis: 0
    }
  },

  executions: [],

  realizedPnL: 0,

  updateExecution(exec) {
    this.executions.push(exec);

    if (exec.pnl) {
      this.realizedPnL += exec.pnl;
    }
  }
};
