const LiquidityPredictionV35 =
  require("../core/prediction/liquidity/liquidityPredictionV35.cjs");

/**
 * SAINT V35 — PREDICTION BRAIN WRAPPER
 */

class LiquidityPredictionBrainV35 {

  constructor() {
    this.engine = new LiquidityPredictionV35();
  }

  ingest(snapshot) {
    this.engine.ingest(snapshot);
  }

  forecast() {
    return this.engine.forecast();
  }
}

module.exports = LiquidityPredictionBrainV35;
