/**
 * SAINT V76 — STREAM SYNC ENGINE
 * Prevents duplicate + stale market updates
 */

class StreamSyncV76 {

  constructor() {
    this.last = new Map();
  }

  sync(update) {

    const prev = this.last.get(update.symbol);

    if (prev && prev.ts >= update.ts) {
      return null; // stale drop
    }

    this.last.set(update.symbol, update);

    return update;
  }
}

module.exports = StreamSyncV76;
