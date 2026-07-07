class SOPHIA {
  constructor(state) {
    this.state = state;
  }

  analyze(tick, prevTick) {
    const prev = prevTick?.price || tick.price;
    const delta = tick.price - prev;

    const strength = Math.min(1, Math.abs(delta) / 20);

    let signal = "HOLD";
    let reason = "neutral state";

    if (delta > 8) {
      signal = "BUY";
      reason = "momentum expansion";
    } else if (delta < -8) {
      signal = "SELL";
      reason = "downward pressure";
    }

    return {
      signal,
      strength: +strength.toFixed(2),
      reason,
      price: tick.price,
      timestamp: tick.timestamp
    };
  }
}

module.exports = SOPHIA;
