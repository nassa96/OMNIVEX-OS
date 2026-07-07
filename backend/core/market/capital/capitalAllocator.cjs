/**
 * SAINT V36 — CAPITAL ALLOCATION ENGINE
 * -------------------------------------
 * Computes position size based on:
 * - venue quality
 * - execution confidence
 * - system learning signal
 * - market regime
 */

class CapitalAllocator {

  constructor(memory) {
    this.memory = memory;

    this.baseRisk = 1.0;
  }

  computeRiskMultiplier(systemLearning, venueStats, regime, prediction) {

    let multiplier = 1.0;

    // ---------------------------
    // SYSTEM HEALTH
    // ---------------------------
    if (systemLearning.confidence === "IMPROVING") {
      multiplier *= 1.2;
    }

    if (systemLearning.confidence === "UNSTABLE") {
      multiplier *= 0.6;
    }

    // ---------------------------
    // VENUE QUALITY
    // ---------------------------
    multiplier *= venueStats.score || 0.5;

    // ---------------------------
    // REGIME ADJUSTMENTS
    // ---------------------------
    if (regime === "SWEEP") multiplier *= 0.4;
    if (regime === "TOXIC") multiplier *= 0.3;
    if (regime === "IGNITION") multiplier *= 1.3;

    // ---------------------------
    // EXECUTION QUALITY
    // ---------------------------
    if (prediction.executionScore > 0.6) multiplier *= 1.2;
    if (prediction.executionScore < 0.3) multiplier *= 0.5;

    return Math.max(0.05, Math.min(2.0, multiplier));
  }

  allocate({ capital, multiplier }) {
    return capital * multiplier;
  }

  compute(params) {

    const {
      capital,
      systemLearning,
      venueStats,
      regime,
      prediction
    } = params;

    const multiplier = this.computeRiskMultiplier(
      systemLearning,
      venueStats,
      regime,
      prediction
    );

    const size = this.allocate({ capital, multiplier });

    return {
      baseCapital: capital,
      multiplier,
      allocatedSize: size,
      riskLevel:
        multiplier < 0.4 ? "LOW" :
        multiplier < 0.8 ? "MEDIUM" : "HIGH"
    };
  }
}

module.exports = CapitalAllocator;
