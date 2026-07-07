/**
 * SAINT V105 — CAPITAL LEDGER V2
 */

class CapitalLedgerV105 {

  constructor() {
    this.entries = [];
  }

  record(entry) {
    this.entries.push({
      ...entry,
      ts: Date.now()
    });
  }

  summary() {
    return {
      totalEntries: this.entries.length,
      ledger: this.entries
    };
  }
}

module.exports = CapitalLedgerV105;
