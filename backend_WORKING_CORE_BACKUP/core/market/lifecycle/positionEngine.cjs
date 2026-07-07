/**
 * SAINT V38 — POSITION LIFECYCLE ENGINE
 * -------------------------------------
 * Tracks full trade lifecycle:
 * entry → live → exit → PnL → evaluation
 */

class PositionEngine {

  constructor() {
    this.positions = new Map(); // id -> position
    this.history = [];
  }

  // ---------------------------
  // OPEN POSITION
  // ---------------------------
  open({ id, symbol, size, entryPrice, venue }) {

    const position = {
      id,
      symbol,
      size,
      venue,
      entryPrice,
      currentPrice: entryPrice,
      status: "OPEN",
      pnl: 0,
      openedAt: Date.now()
    };

    this.positions.set(id, position);

    return position;
  }

  // ---------------------------
  // UPDATE MARKET PRICE
  // ---------------------------
  updatePrice(id, price) {

    const pos = this.positions.get(id);
    if (!pos) return null;

    pos.currentPrice = price;

    pos.pnl = (price - pos.entryPrice) * pos.size;

    return pos;
  }

  // ---------------------------
  // CLOSE POSITION
  // ---------------------------
  close(id, exitPrice) {

    const pos = this.positions.get(id);
    if (!pos) return null;

    pos.status = "CLOSED";
    pos.exitPrice = exitPrice;

    pos.pnl = (exitPrice - pos.entryPrice) * pos.size;

    pos.duration = Date.now() - pos.openedAt;

    this.history.push(pos);
    this.positions.delete(id);

    return pos;
  }

  // ---------------------------
  // PERFORMANCE METRICS
  // ---------------------------
  getStats() {

    const all = this.history;

    const wins = all.filter(p => p.pnl > 0).length;
    const losses = all.filter(p => p.pnl <= 0).length;

    const totalPnL = all.reduce((a,b)=>a + (b.pnl || 0), 0);

    const avgPnL = all.length ? totalPnL / all.length : 0;

    const winRate = all.length ? wins / all.length : 0;

    return {
      totalTrades: all.length,
      wins,
      losses,
      winRate,
      totalPnL,
      avgPnL
    };
  }

  // ---------------------------
  // TRADE QUALITY SCORE
  // ---------------------------
  evaluateTrade(id) {

    const pos = this.history.find(p => p.id === id);
    if (!pos) return null;

    const quality =
      pos.pnl > 0 ? 1 : 0;

    const speedBonus =
      pos.duration < 10000 ? 0.2 : 0;

    const score = quality + speedBonus;

    return {
      id,
      pnl: pos.pnl,
      score,
      label:
        score > 1 ? "EXCELLENT" :
        score > 0.5 ? "OK" :
        "POOR"
    };
  }
}

module.exports = PositionEngine;
