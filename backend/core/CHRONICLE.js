class CHRONICLE {
  constructor() {
    this.ledger = [];
  }

  record(event) {
    this.ledger.push({
      ts: Date.now(),
      event
    });

    if (this.ledger.length > 5000) {
      this.ledger.shift();
    }
  }

  replay() {
    const state = {
      braintrust: [],
      ticks: 0,
      lastTick: null,
      lastSignal: null
    };

    for (const entry of this.ledger) {
      const e = entry.event;

      if (e.type === "TICK") {
        state.ticks++;
        state.lastTick = e.tick;
      }

      if (e.type === "SIGNAL") {
        state.lastSignal = e.signal;
      }

      if (e.type === "BRAINTS") {
        state.braintrust.push(e.payload);
      }
    }

    return state;
  }

  snapshot() {
    return {
      size: this.ledger.length,
      last: this.ledger[this.ledger.length - 1] || null
    };
  }
}

module.exports = CHRONICLE;
