class STREAMCORE {
  constructor(state) {
    this.state = state;
    this.queue = [];
  }

  ingest(tick) {
    this.queue.push({ type: "TICK", tick });
  }

  normalize(tick) {
    return {
      price: tick.price,
      symbol: tick.symbol,
      ts: tick.timestamp
    };
  }

  process(tick) {
    const last = this.state.lastTick?.price || tick.price;
    const volatility = Math.abs(tick.price - last);

    const signal =
      volatility > 10
        ? { signal: "SELL", strength: 0.7, reason: "vol spike" }
        : volatility > 5
        ? { signal: "BUY", strength: 0.6, reason: "momentum" }
        : { signal: "HOLD", strength: 0.5, reason: "neutral" };

    this.state.lastTick = tick;
    this.state.ticks++;

    const entry = {
      tick,
      signal,
      meta: {
        volatility,
        tickIndex: this.state.ticks
      }
    };

    this.state.braintrust.push(entry);

    if (this.state.braintrust.length > 500) {
      this.state.braintrust.shift();
    }

    this.state.lastSignal = signal;

    return entry;
  }
}

module.exports = STREAMCORE;
