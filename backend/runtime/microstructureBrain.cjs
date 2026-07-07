const ToxicFlowEngine = require("../core/market/microstructure/toxicFlowEngine.cjs");

/**
 * SAINT V20 — MICROSTRUCTURE BRAIN
 */

class MicrostructureBrain {

  constructor() {
    this.engine = new ToxicFlowEngine();
  }

  update(orderbook) {
    return this.engine.analyze(orderbook);
  }
}

module.exports = MicrostructureBrain;
