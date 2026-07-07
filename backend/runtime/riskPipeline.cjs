const RiskGate = require("../core/risk/aegis/riskGate.cjs");

/**
 * SAINT V16 — RISK PIPELINE
 * Central execution safety checkpoint
 */

class RiskPipeline {

  constructor() {
    this.gate = new RiskGate();
  }

  process(signal, portfolio, market) {

    return this.gate.validate(signal, portfolio, market);
  }
}

module.exports = RiskPipeline;
