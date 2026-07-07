/**
 * SAINT V60 — CAPITAL ROTATION ENGINE
 */

class CapitalRotationEngineV60 {

  constructor() {
    this.allocations = {
      TREND: 0.4,
      MEAN_REVERSION: 0.3,
      ARB: 0.2,
      DEFENSIVE: 0.1
    };
  }

  rebalance(regime, executionQuality, flow) {

    const quality = executionQuality?.quality || 0.5;
    const pressure = flow?.flowDelta || 0;

    if (regime === "TRENDING_BULL" || regime === "TRENDING_BEAR") {
      this.allocations.TREND = Math.min(0.7, 0.4 + quality);
      this.allocations.MEAN_REVERSION = 0.2;
    }

    if (regime === "CHOP") {
      this.allocations.MEAN_REVERSION = 0.5;
      this.allocations.TREND = 0.2;
    }

    if (regime === "MANIPULATION") {
      this.allocations.DEFENSIVE = 0.7;
      this.allocations.TREND = 0.1;
    }

    if (Math.abs(pressure) > 0.5) {
      this.allocations.ARB = 0.4;
    }

    return this.allocations;
  }

  getAllocation(strategy) {
    return this.allocations[strategy] || 0;
  }
}

module.exports = CapitalRotationEngineV60;
