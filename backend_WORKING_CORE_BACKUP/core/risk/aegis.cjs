class AEGIS {
  constructor(config = {}) {
    this.equity = config.equity || 10000;

    this.maxRiskPerTrade = config.maxRiskPerTrade || 0.02; // 2%
    this.maxExposure = config.maxExposure || 0.5; // 50% capital max

    this.currentExposure = 0;
    this.drawdown = 0;

    this.positionHistory = [];
  }

  evaluate({ signal, market, regime }) {

    const price = market.price;

    // -----------------------------
    // 1. BASE CONFIDENCE RISK
    // -----------------------------
    let riskMultiplier = signal.confidence || 0.5;

    // -----------------------------
    // 2. REGIME ADJUSTMENT
    // -----------------------------
    switch (regime?.regime) {
      case "HIGH_VOLATILITY":
        riskMultiplier *= 0.3;
        break;

      case "LOW_LIQUIDITY":
        riskMultiplier *= 0.2;
        break;

      case "TRENDING_UP":
      case "TRENDING_DOWN":
        riskMultiplier *= 1.2;
        break;

      case "RANGING":
        riskMultiplier *= 0.8;
        break;
    }

    // -----------------------------
    // 3. DRAWDOWN CONTROL
    // -----------------------------
    if (this.drawdown > 0.1) {
      riskMultiplier *= 0.5;
    }

    // -----------------------------
    // 4. POSITION SIZE CALCULATION
    // -----------------------------
    const baseRisk = this.equity * this.maxRiskPerTrade;
    const positionSize = (baseRisk * riskMultiplier) / price;

    // -----------------------------
    // 5. EXPOSURE CHECK
    // -----------------------------
    const projectedExposure = this.currentExposure + (positionSize * price);

    let approved = true;

    if (projectedExposure > this.equity * this.maxExposure) {
      approved = false;
    }

    // -----------------------------
    // 6. FINAL DECISION
    // -----------------------------
    const decision = approved ? "ALLOW" : "BLOCK";

    const output = {
      decision,
      positionSize: approved ? positionSize : 0,
      riskUsed: baseRisk * riskMultiplier,
      exposure: projectedExposure,
      regime: regime?.regime,
      confidence: signal.confidence
    };

    if (approved) {
      this.currentExposure = projectedExposure;
      this.positionHistory.push(output);
    }

    return output;
  }

  updateFromFill(fill) {
    const value = fill.price * fill.qty;

    if (fill.side === "BUY") {
      this.currentExposure += value;
    } else {
      this.currentExposure -= value;
    }
  }

  updateDrawdown(equityNow) {
    const peak = this.equity;
    this.drawdown = (peak - equityNow) / peak;
  }
}

module.exports = AEGIS;
