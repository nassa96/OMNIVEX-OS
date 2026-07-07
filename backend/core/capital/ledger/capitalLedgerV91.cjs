/**
 * SAINT V91 — CAPITAL LEDGER
 */

class CapitalLedgerV91 {

  constructor() {
    this.records = [];
  }

  record(entry) {
    this.records.push({
      ...entry,
      ts: Date.now()
    });
  }

  balance() {
    return this.records.reduce((acc, r) => acc + (r.pnl || 0), 0);
  }
}

module.exports = CapitalLedgerV91;
