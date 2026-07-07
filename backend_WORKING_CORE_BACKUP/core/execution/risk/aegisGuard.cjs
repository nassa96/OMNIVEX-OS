class AegisGuard {
  evaluate(signal, context = {}) {
    if (!signal) {
      return { approved: false, reason: "NO_SIGNAL" };
    }

    const riskScore = this.calculateRisk(signal, context);

    if (riskScore > 70) {
      return {
        approved: false,
        reason: "RISK_TOO_HIGH",
        riskScore
      };
    }

    return {
      approved: true,
      riskScore
    };
  }

  calculateRisk(signal, context) {
    let score = 20;

    if (signal.leverage && signal.leverage > 3) score += 30;
    if (signal.confidence && signal.confidence < 0.6) score += 30;
    if (context.volatility && context.volatility > 0.8) score += 25;

    return score;
  }
}

module.exports = new AegisGuard();
