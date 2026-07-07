const PredictionRLV37 =
  require("../core/learning/prediction/predictionRLV37.cjs");

/**
 * SAINT V37 — PREDICTION RL BRAIN WRAPPER
 */

class PredictionRLBrainV37 {

  constructor() {
    this.engine = new PredictionRLV37();
  }

  record(prediction) {
    this.engine.record(prediction);
  }

  train(actualSnapshot) {
    return this.engine.train(actualSnapshot);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = PredictionRLBrainV37;
