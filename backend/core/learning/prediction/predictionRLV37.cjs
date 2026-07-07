/**
 * SAINT V37 — PREDICTION REINFORCEMENT LEARNING LOOP
 * --------------------------------------------------
 * Evaluates prediction accuracy and improves forecasting model
 */

class PredictionRLV37 {

  constructor() {

    this.predictions = [];
    this.weights = {
      shiftAccuracy: 1.0,
      spoofDetectionAccuracy: 1.0,
      directionalAccuracy: 1.0
    };
  }

  // =====================================================
  // STORE PREDICTION
  // =====================================================
  record(prediction) {

    this.predictions.push({
      ...prediction,
      ts: Date.now(),
      evaluated: false
    });

    if (this.predictions.length > 500) {
      this.predictions.shift();
    }
  }

  // =====================================================
  // EVALUATE PREDICTIONS AGAINST ACTUAL OUTCOME
  // =====================================================
  evaluate(actualSnapshot) {

    let totalError = 0;
    let count = 0;

    for (const p of this.predictions) {

      if (p.evaluated) continue;

      const error =
        this._computeError(p, actualSnapshot);

      p.error = error;
      p.evaluated = true;

      totalError += error;
      count++;
    }

    return count ? totalError / count : 0;
  }

  // =====================================================
  // ERROR FUNCTION
  // =====================================================
  _computeError(prediction, actual) {

    let error = 0;

    // -------------------------
    // LIQUIDITY SHIFT ERROR
    // -------------------------
    const predictedShifts = prediction.shifts || [];
    const actualImbalance = actual.imbalance || 0;

    const predictedBias =
      predictedShifts.reduce((a, s) => a + s.probability, 0);

    error += Math.abs(predictedBias - actualImbalance);

    // -------------------------
    // SPOOF DETECTION ERROR
    // -------------------------
    const predictedSpoof = prediction.spoofSignals?.length || 0;
    const actualSpoof = actual.spoofSignals?.length || 0;

    error += Math.abs(predictedSpoof - actualSpoof);

    return error;
  }

  // =====================================================
  // UPDATE MODEL WEIGHTS
  // =====================================================
  updateModel() {

    const recent = this.predictions.slice(-100);

    let avgError = 0;
    let n = 0;

    for (const p of recent) {
      if (!p.evaluated) continue;
      avgError += p.error;
      n++;
    }

    if (n === 0) return this.weights;

    avgError /= n;

    // -------------------------
    // ADJUST WEIGHTS BASED ON ERROR
    // -------------------------
    if (avgError > 0.5) {
      this.weights.shiftAccuracy *= 0.95;
      this.weights.spoofDetectionAccuracy *= 0.95;
    } else {
      this.weights.shiftAccuracy *= 1.02;
      this.weights.spoofDetectionAccuracy *= 1.02;
    }

    // clamp
    for (const k in this.weights) {
      this.weights[k] = Math.max(0.1, Math.min(3, this.weights[k]));
    }

    return this.weights;
  }

  // =====================================================
  // FULL TRAINING STEP
  // =====================================================
  train(actualSnapshot) {

    const error = this.evaluate(actualSnapshot);
    const weights = this.updateModel();

    return {
      error,
      weights
    };
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      weights: this.weights,
      pending: this.predictions.filter(p => !p.evaluated).length
    };
  }
}

module.exports = PredictionRLV37;
