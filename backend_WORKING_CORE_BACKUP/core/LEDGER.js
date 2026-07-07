class LEDGER {
  constructor() {
    this.events = [];
  }

  write(event) {
    this.events.push({
      ts: Date.now(),
      ...event
    });

    if (this.events.length > 10000) {
      this.events.shift();
    }
  }

  replay() {
    const state = {
      pnl: 0,
      trades: 0,
      position: 0
    };

    for (const e of this.events) {
      if (e.type === "EXECUTION" && e.data.executed) {
        state.trades++;

        if (e.data.action === "BUY") state.position++;
        if (e.data.action === "SELL") state.position--;
      }
    }

    return state;
  }

  snapshot() {
    return {
      size: this.events.length,
      last: this.events[this.events.length - 1] || null
    };
  }
}

module.exports = LEDGER;
