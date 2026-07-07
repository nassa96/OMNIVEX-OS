class AegisRiskEngine {
  constructor() {
    this.maxRisk = 0.65;
    this.volatilityThreshold = 0.08;
    this.positionCap = 1000;
  }

  evaluate(signal, marketEvent) {
    if (!signal || !marketEvent) {
      return this.deny("INVALID_INPUT");
    }

    const riskScore = this.calculateRisk(signal, marketEvent);

    const volatilityLock =
      Math.abs(marketEvent.change || 0) > this.volatilityThreshold;

    const approved =
      riskScore < this.maxRisk && !volatilityLock;

    return {
      approved,
      reason: approved ? "OK" : "RISK_BLOCK",
      riskScore,
      maxPositionSize: approved ? this.positionCap : 0,
      volatilityLock
    };
  }

  calculateRisk(signal, event) {
    let risk = 0;

    // 1. Confidence penalty (low confidence = higher risk)
    const confidence = signal.confidence || 0;
    risk += (1 - confidence) * 0.5;

    // 2. Volatility contribution
    const change = Math.abs(event.change || 0);
    risk += Math.min(change * 2, 0.3);

    // 3. Side instability penalty (HOLD is safer)
    if (signal.side === "HOLD") {
      risk += 0.1;
    }

    return Math.min(1, risk);
  }

  deny(reason) {
    return {
      approved: false,
      reason,
      riskScore: 1,
      maxPositionSize: 0,
      volatilityLock: true
    };
  }
}

module.exports = new AegisRiskEngine();
