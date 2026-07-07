const AdversarialMarketV39 =
  require("../core/intelligence/adversarial/adversarialMarketV39.cjs");

/**
 * SAINT V39 — ADVERSARIAL BRAIN WRAPPER
 */

class AdversarialBrainV39 {

  constructor() {
    this.engine = new AdversarialMarketV39();
  }

  analyze(context) {
    return this.engine.adversarialScore(context);
  }
}

module.exports = AdversarialBrainV39;
