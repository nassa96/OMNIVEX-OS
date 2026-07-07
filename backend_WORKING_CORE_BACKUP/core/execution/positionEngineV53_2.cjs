/**
 * SAINT V53.2 — POSITION ENGINE
 * Tracks open positions + lifecycle
 */

class PositionEngineV53_2 {

  constructor() {
    this.positions = {};
  }

  open(order, fillPrice) {

    this.positions[order.id] = {
      symbol: order.symbol,
      side: order.side,
      size: order.size,
      entry: fillPrice,
      status: "OPEN",
      pnl: 0
    };
  }

  updatePrice(symbol, price) {

    for (const id in this.positions) {

      const p = this.positions[id];

      if (p.symbol !== symbol) continue;

      if (p.side === "BUY") {
        p.pnl = (price - p.entry) * p.size;
      } else {
        p.pnl = (p.entry - price) * p.size;
      }
    }
  }

  close(id) {

    if (!this.positions[id]) return null;

    this.positions[id].status = "CLOSED";

    return this.positions[id];
  }

  snapshot() {
    return this.positions;
  }
}

module.exports = PositionEngineV53_2;
