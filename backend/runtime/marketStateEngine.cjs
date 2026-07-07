const RegimeEngine = require("../core/market/regime/regimeEngine.cjs");

/**
 * SAINT V18 — MARKET STATE ENGINE
 * Global market context provider
 */

class MarketStateEngine {

  constructor() {
    this.regime = new RegimeEngine();
  }

  update(market) {
    return this.regime.analyze(market);
  }
}

module.exports = MarketStateEngine;
