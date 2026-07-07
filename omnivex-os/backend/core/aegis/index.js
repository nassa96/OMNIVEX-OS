class Aegis {
  constructor(forge) {
    this.forge = forge;

    this.maxRiskPerTrade = 0.7;
    this.maxSystemDrawdown = -15;
    this.maxExposure = 5; // active positions limit
  }

  evaluate(decision, saintState) {
    const positions = Object.keys(saintState.positions || {});
    const exposure = positions.length;

    const forgePower = this.forge.agents?.SAINT?.power || 0;

    const riskScore =
      (exposure / this.maxExposure) +
      Math.abs(forgePower / 100);

    const allowed = riskScore < this.maxRiskPerTrade;

    const emergencyStop =
      forgePower < this.maxSystemDrawdown;

    return {
      allowed: allowed && !emergencyStop,
      riskScore,
      exposure,
      emergencyStop,
      reason: !allowed
        ? "RISK_LIMIT"
        : emergencyStop
        ? "DRAWDOWN_STOP"
        : "OK"
    };
  }
}

module.exports = Aegis;
