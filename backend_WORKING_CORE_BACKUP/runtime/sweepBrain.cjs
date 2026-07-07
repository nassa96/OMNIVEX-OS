const LiquiditySweepEngine = require("../core/market/sweep/liquiditySweepEngine.cjs");

/**
 * SAINT V23 — SWEEP BRAIN
 */

class SweepBrain {

  constructor() {
    this.engine = new LiquiditySweepEngine();
  }

  update(candle) {
    return this.engine.analyze(candle);
  }
}

module.exports = SweepBrain;
