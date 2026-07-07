/**
 * SAINT V97 — LEDGER SYNC SYSTEM
 */

class LedgerSyncV97 {

  constructor() {
    this.ledger = [];
  }

  sync(order, execution) {

    this.ledger.push({
      order,
      execution,
      delta: execution.price - order.expectedPrice,
      ts: Date.now()
    });
  }

  audit() {
    return this.ledger;
  }
}

module.exports = LedgerSyncV97;
