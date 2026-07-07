const EnsemblePredictionV38 =
  require("../core/prediction/ensemble/ensemblePredictionV38.cjs");

/**
 * SAINT V38 — ENSEMBLE BRAIN WRAPPER
 */

class EnsembleBrainV38 {

  constructor() {
    this.engine = new EnsemblePredictionV38();
  }

  predict(context) {
    return this.engine.predict(context);
  }

  update(performanceLog) {
    return this.engine.updateWeights(performanceLog);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = EnsembleBrainV38;
