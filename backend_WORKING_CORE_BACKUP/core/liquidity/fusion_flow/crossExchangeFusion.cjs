const LatencyClock = require("../clock/latencyClock.cjs");

/**
 * SAINT V9 + V8 — TIME-CORRECTED CROSS EXCHANGE FLOW ENGINE
 */

class CrossExchangeFusion {

  constructor() {

    this.buffer = [];
    this.maxBuffer = 500;

    this.clock = new LatencyClock();

    this.venueWeight = {
      binance: 1.0,
      coinbase: 0.9
    };
  }

  ingest(trade) {

    // ---------------------------
    // UPDATE LATENCY MODEL
    // ---------------------------
    this.clock.updateLatency(trade.venue, trade.ts);

    const normalized = this.normalizeTrade(trade);

    this.buffer.push(normalized);

    if (this.buffer.length > this.maxBuffer) {
      this.buffer.shift();
    }
  }

  normalizeTrade(t) {

    const weight = this.venueWeight[t.venue] || 1;

    const corrected = this.clock.normalizeTrade(t);

    return {
      ...corrected,
      weight
    };
  }

  buildCausalStream() {

    return this.clock.snapshot(this.buffer).causalStream;
  }

  computeFlowPressure() {

    const stream = this.buildCausalStream();

    let buy = 0;
    let sell = 0;

    for (const i of stream) {

      const impact =
        (i.size * i.weight) *
        (i.side === "buy" ? 1 : -1);

      if (impact > 0) buy += impact;
      else sell += Math.abs(impact);
    }

    const total = buy + sell || 1;

    return {
      buyPressure: buy / total,
      sellPressure: sell / total,
      imbalance: (buy - sell) / total
    };
  }

  computeMomentum() {

    const stream = this.buildCausalStream();

    if (stream.length < 20) return 0;

    const recent = stream.slice(-10);
    const older = stream.slice(-40, -10);

    const rAvg =
      recent.reduce((a,b)=>a + b.price,0)/recent.length;

    const oAvg =
      older.reduce((a,b)=>a + b.price,0)/older.length;

    return rAvg - oAvg;
  }

  analyze() {

    const pressure = this.computeFlowPressure();
    const momentum = this.computeMomentum();

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

    return {
      signal,
      confidence,
      pressure,
      momentum,
      latencyModel: this.clock.latency
    };
  }

  reset() {
    this.buffer = [];
  }
}

module.exports = CrossExchangeFusion;
