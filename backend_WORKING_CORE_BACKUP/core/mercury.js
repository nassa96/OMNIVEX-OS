/**
 * MERCURY ENGINE
 * Market data simulation / ingestion layer
 */

export class Mercury {
  constructor(state) {
    this.state = state;
  }

  tick() {
    const drift = (Math.random() - 0.5) * 40;

    const newPrice = Math.max(
      1,
      this.state.market.price + drift
    );

    const tick = {
      symbol: this.state.market.symbol,
      price: Number(newPrice.toFixed(2)),
      timestamp: Date.now(),
      source: "MERCURY_LOOP"
    };

    this.state.market.price = tick.price;
    this.state.lastTick = tick;
    this.state.ticks++;

    return tick;
  }
}
