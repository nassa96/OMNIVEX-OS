const ToxicFlowEngine = require("../toxic/toxicFlowEngine.cjs");
const OrderFlowEngine = require("../orderflow/orderFlowEngine.cjs");

/**
 * SAINT V4 + V5 + V6 — FULL MARKET INTELLIGENCE STACK
 */

class MicrostructureEngine {

  constructor() {
    this.toxic = new ToxicFlowEngine();
    this.flow = new OrderFlowEngine();
  }

  ingestTrade(trade) {
    this.flow.ingestTrade(trade);
  }

  predict(fusedBook) {

    const toxicity = this.toxic.analyze(fusedBook);
    const flow = this.flow.analyze();

    // ---------------------------
    // HARD BLOCK CONDITIONS
    // ---------------------------
    if (toxicity.toxicity > 0.75) {
      return {
        signal: "HOLD",
        confidence: 0,
        reason: "TOXIC_FLOW_BLOCK",
        toxicity
      };
    }

    if (flow.signal === "HOLD") {
      return {
        signal: "HOLD",
        confidence: flow.confidence,
        reason: "FLOW_NEUTRAL",
        flow,
        toxicity
      };
    }

    // ---------------------------
    // MERGED SIGNAL ENGINE
    // ---------------------------
    let signal = flow.signal;

    let confidence =
      flow.confidence * (1 - toxicity.toxicity);

    // ---------------------------
    // FINAL SAFETY DAMPENING
    // ---------------------------
    if (toxicity.toxicity > 0.4) {
      confidence *= 0.7;
    }

    return {
      signal,
      confidence,
      flow,
      toxicity
    };
  }
}

module.exports = MicrostructureEngine;
