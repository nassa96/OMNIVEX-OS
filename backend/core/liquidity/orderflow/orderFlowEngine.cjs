/**
 * SAINT V7 + V6 — REAL ORDER FLOW ENGINE
 */

class OrderFlowEngine {

  constructor() {

    this.flowWindow = [];
    this.maxWindow = 300;
  }

  ingestTrade(trade) {

    this.flowWindow.push({
      price: trade.price,
      size: trade.size,
      side: trade.side,
      venue: trade.venue,
      ts: trade.ts
    });

    if (this.flowWindow.length > this.maxWindow) {
      this.flowWindow.shift();
    }
  }

  computePressure() {

    let buy = 0;
    let sell = 0;

    for (const t of this.flowWindow) {
      if (t.side === "buy") buy += t.size;
      else sell += t.size;
    }

    const total = buy + sell || 1;

    return {
      buyPressure: buy / total,
      sellPressure: sell / total,
      imbalance: (buy - sell) / total
    };
  }

  computeMomentum() {

    if (this.flowWindow.length < 20) return 0;

    const recent = this.flowWindow.slice(-10);
    const older = this.flowWindow.slice(-40, -10);

    const rAvg =
      recent.reduce((a,b)=>a+b.price,0)/recent.length;

    const oAvg =
      older.reduce((a,b)=>a+b.price,0)/older.length;

    return rAvg - oAvg;
  }

  detectAbsorption() {

    let hits = 0;

    const last = this.flowWindow.slice(-30);

    for (const t of last) {
      if (t.size > 10) hits++;
    }

    return Math.min(1, hits / 15);
  }

  analyze() {

    const pressure = this.computePressure();
    const momentum = this.computeMomentum();
    const absorption = this.detectAbsorption();

    let signal = "HOLD";
    let confidence = 0;

    if (pressure.imbalance > 0.25 && momentum > 0) {
      signal = "LONG";
      confidence = pressure.imbalance + Math.min(1, momentum / 100);
    }

    if (pressure.imbalance < -0.25 && momentum < 0) {
      signal = "SHORT";
      confidence = Math.abs(pressure.imbalance) + Math.min(1, Math.abs(momentum) / 100);
    }

    if (absorption > 0.6) {
      signal = "HOLD";
      confidence *= 0.5;
    }

    return {
      signal,
      confidence,
      pressure,
      momentum,
      absorption
    };
  }
}

module.exports = OrderFlowEngine;
