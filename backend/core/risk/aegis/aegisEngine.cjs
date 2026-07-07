/**
 * SAINT V18 — AEGIS UPDATED WITH REGIME AWARENESS
 */

class AegisEngine {

  constructor() {

    this.killSwitch = false;
    this.currentExposure = 0;
    this.maxExposure = 1.0;
  }

  evaluate(signal, portfolio, marketState) {

    if (this.killSwitch) {
      return { allowed: false, reason: "KILL_SWITCH" };
    }

    const regimePenalty = this.regimeRisk(marketState);
    const exposureRisk = this.currentExposure / this.maxExposure;

    const riskScore =
      regimePenalty + exposureRisk;

    const allowed = riskScore < 0.65;

    return {
      allowed,
      riskScore,
      regimePenalty,
      exposureRisk,
      marketState
    };
  }

  regimeRisk(state) {

    let risk = 0;

    if (state.volatility === "CHAOTIC") risk += 0.5;
    if (state.volatility === "HIGH") risk += 0.3;

    if (state.liquidity === "DISLOCATED") risk += 0.4;
    if (state.liquidity === "THIN") risk += 0.2;

    if (state.trend === "BREAKOUT") risk += 0.1;

    return Math.min(1, risk);
  }
}

module.exports = AegisEngine;
