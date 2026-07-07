const CapitalRotationV43 =
  require("../core/capital/portfolio/capitalRotationV43.cjs");

/**
 * SAINT V43 — CAPITAL ROTATION BRAIN WRAPPER
 */

class CapitalRotationBrainV43 {

  constructor() {
    this.engine = new CapitalRotationV43();
  }

  updateStrategy(name, metrics) {
    this.engine.updateStrategy(name, metrics);
  }

  updateAsset(symbol, metrics) {
    this.engine.updateAsset(symbol, metrics);
  }

  rotate(capital) {
    return this.engine.rotate(capital);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = CapitalRotationBrainV43;
