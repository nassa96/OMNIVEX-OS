/**
 * SAINT V21 — ORDER FLOW INTELLIGENCE ENGINE
 * ------------------------------------------
 * Reconstructs market intent from trades + book changes
 */

class OrderFlowEngine {

  constructor() {

    this.flowHistory = [];
    this.maxHistory = 200;
  }

  // ---------------------------
  // INGEST TRADE PRINT
  // ---------------------------
  ingestTrade(trade) {

    this.flowHistory.push({
      price: trade.price,
      size: trade.size || 1,
      side: trade.side, // buy/sell
      ts: Date.now()
    });

    if (this.flowHistory.length > this.maxHistory) {
      this.flowHistory.shift();
    }
  }

  // ---------------------------
  // BUY/SELL PRESSURE
  // ---------------------------
  pressure(window = 50) {

    const slice = this.flowHistory.slice(-window);

    let buy = 0;
    let sell = 0;

    for (const t of slice) {

      if (t.side === "buy") buy += t.size;
      if (t.side === "sell") sell += t.size;
    }

    const total = buy + sell;

    if (total === 0) return 0;

    return (buy - sell) / total;
  }

  // ---------------------------
  // FLOW MOMENTUM (ACCELERATION)
  // ---------------------------
  momentum() {

    if (this.flowHistory.length < 20) return 0;

    const recent = this.flowHistory.slice(-20);

    let score = 0;

    for (let i = 1; i < recent.length; i++) {

      const prev = recent[i - 1];
      const curr = recent[i];

      if (curr.side === prev.side) {
        score += curr.size;
      } else {
        score -= curr.size;
      }
    }

    return score / recent.length;
  }

  // ---------------------------
  // SMART MONEY SIGNAL
  // ---------------------------
  smartMoneySignal() {

    const pressure = this.pressure();
    const momentum = this.momentum();

    const score = (pressure * 0.6) + (momentum * 0.4);

    if (score > 0.3) return "ACCUMULATION";
    if (score < -0.3) return "DISTRIBUTION";

    return "NEUTRAL";
  }

  // ---------------------------
  // FLOW STRENGTH
  // ---------------------------
  strength() {

    const pressure = Math.abs(this.pressure());
    const momentum = Math.abs(this.momentum());

    return Math.min(1, (pressure + momentum) / 2);
  }

  // ---------------------------
  // FULL ANALYSIS
  // ---------------------------
  analyze(trade) {

    if (trade) this.ingestTrade(trade);

    return {
      pressure: this.pressure(),
      momentum: this.momentum(),
      signal: this.smartMoneySignal(),
      strength: this.strength()
    };
  }
}

module.exports = OrderFlowEngine;
