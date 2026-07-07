/**
 * SAINT V73 — STATE LEDGER
 * Immutable execution truth log
 */

class StateLedgerV73 {

  constructor() {
    this.ledger = [];
  }

  record(entry) {
    this.ledger.push({
      ...entry,
      ts: Date.now()
    });
  }

  getAll() {
    return this.ledger;
  }
}

module.exports = StateLedgerV73;
