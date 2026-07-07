const CorrelationEngine = require("../core/market/correlation/correlationEngine.cjs");

/**
 * SAINT V19 — MACRO MARKET BRAIN
 */

class MacroMarketBrain {

  constructor() {
    this.engine = new CorrelationEngine();
  }

  update(marketData, regimes) {
    return this.engine.analyze(marketData, regimes);
  }
}

module.exports = MacroMarketBrain;
