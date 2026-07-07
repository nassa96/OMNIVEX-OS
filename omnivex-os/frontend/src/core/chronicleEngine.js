/**
 * OMNIVEX CHRONICLE ENGINE
 * ------------------------
 * Deterministic event store + replay system
 */

class ChronicleEngine {
  constructor() {
    this.events = [];
    this.pointer = 0;
  }

  /* =========================
     ADD EVENT (IMMUTABLE LOG)
  ========================= */
  push(event) {
    const enriched = {
      ...event,
      id: this.events.length,
      ts: event.ts || Date.now()
    };

    this.events.push(enriched);
    return enriched;
  }

  /* =========================
     GET FULL HISTORY
  ========================= */
  getAll() {
    return this.events;
  }

  /* =========================
     MOVE REPLAY POINTER
  ========================= */
  seek(index) {
    if (index < 0) index = 0;
    if (index >= this.events.length) index = this.events.length - 1;

    this.pointer = index;
    return this.getStateAt(index);
  }

  /* =========================
     RECONSTRUCT SYSTEM STATE
  ========================= */
  getStateAt(index) {
    const slice = this.events.slice(0, index + 1);

    const state = {
      market: [],
      signals: [],
      executions: [],
      lastMarket: null,
      lastSignal: null
    };

    for (const e of slice) {
      switch (e.type) {
        case "MARKET":
          state.market = e.market || state.market;

          if (e.symbol && e.price) {
            state.lastMarket = `${e.symbol} ${e.price}`;
          }
          break;

        case "SIGNAL":
          state.signals.push(e.signal);
          state.lastSignal = e.signal;
          break;

        case "EXECUTION":
          state.executions.push(e);
          break;
      }
    }

    return state;
  }

  /* =========================
     CURRENT STATE
  ========================= */
  current() {
    return this.getStateAt(this.pointer);
  }
}

const chronicle = new ChronicleEngine();

export default chronicle;
