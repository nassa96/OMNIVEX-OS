const LiquidityFusionV33 =
  require("../core/liquidity/fusion/liquidityFusionV33.cjs");

/**
 * SAINT V33 — LIQUIDITY FUSION BRAIN
 */

class LiquidityFusionBrainV33 {

  constructor() {
    this.engine = new LiquidityFusionV33();
  }

  ingest(exchange, book) {
    this.engine.ingest(exchange, book);
  }

  mid() {
    return this.engine.midPrice();
  }

  imbalance() {
    return this.engine.imbalance();
  }

  stress() {
    return this.engine.stress();
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = LiquidityFusionBrainV33;
