/**
 * SAINT V77 — EVENT LEDGER
 * Immutable system event storage
 */

class EventLedgerV77 {

  constructor(db) {
    this.db = db;
  }

  async record(event) {

    return await this.db.insert("events", {
      type: event.type,
      payload: event.payload,
      ts: Date.now()
    });
  }
}

module.exports = EventLedgerV77;
