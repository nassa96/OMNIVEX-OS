/**
 * SAINT V97 — EXECUTION RECONCILIATION SYSTEM
 */

class ExecutionReconcilerV97 {

  constructor() {
    this.records = [];
  }

  log(intent, execution) {

    this.records.push({
      intent,
      execution,
      ts: Date.now()
    });
  }

  reconcile(latestMarketPrice) {

    return this.records.map(r => {

      const slippage = Math.abs(
        (r.execution.price || latestMarketPrice) - latestMarketPrice
      );

      return {
        intent: r.intent,
        executed: r.execution,
        slippage,
        valid: slippage < 5
      };
    });
  }
}

module.exports = ExecutionReconcilerV97;
