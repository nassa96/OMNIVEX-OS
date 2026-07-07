class AdaptiveAEGIS {
  constructor(config = {}) {
    this.equity = config.equity || 10000;

    this.baseRisk = config.baseRisk || 0.02;
    this.maxExposure = config.maxExposure || 0.5;

    // regime → learned weight
    this.regimeWeights = new Map();

    // performance memory
    this.memory = [];
  }

  _getRegimeWeight(regime) {
    if (!this.regimeWeights.has(regime)) {
      this.regimeWeights.set(regime, 1.0);
    }
    return this.regimeWeights.get(regime);
  }

  evaluate({ signal, market, regime, executionHint }) {

    const price = market.price;

    const regimeKey = regime?.regime || "UNKNOWN";
    let weight = this._getRegimeWeight(regimeKey);

    // ----------------------------
    // 1. SIGNAL INFLUENCE
    // ----------------------------
    let riskFactor = signal.confidence;

    // ----------------------------
    // 2. ADAPTIVE REGIME WEIGHT
    // ----------------------------
    riskFactor *= weight;

    // ----------------------------
    // 3. EXECUTION QUALITY FEEDBACK
    // ----------------------------
    if (executionHint?.avgQuality < 0.4) {
      riskFactor *= 0.6;
    }

    if (executionHint?.avgSlippage > 0.003) {
      riskFactor *= 0.5;
    }

    // ----------------------------
    // 4. POSITION SIZING
    // ----------------------------
    const baseRisk = this.equity * this.baseRisk;
    const positionSize = (baseRisk * riskFactor) / price;

    const exposure = positionSize * price;
    const allowed = exposure < this.equity * this.maxExposure;

    return {
      decision: allowed ? "ALLOW" : "BLOCK",
      positionSize: allowed ? positionSize : 0,
      regime: regimeKey,
      weight,
      riskFactor
    };
  }

  // ----------------------------
  // 5. REINFORCEMENT UPDATE
  // ----------------------------
  learn({ regime, quality }) {
    const key = regime || "UNKNOWN";

    const reward =
      quality.score - Math.abs(quality.slippage) * 2;

    const current = this._getRegimeWeight(key);

    let updated = current + (reward - 0.5) * 0.05;

    // clamp stability
    updated = Math.max(0.2, Math.min(1.8, updated));

    this.regimeWeights.set(key, updated);

    this.memory.push({
      regime: key,
      reward,
      newWeight: updated,
      ts: Date.now()
    });

    if (this.memory.length > 2000) {
      this.memory.shift();
    }
  }

  getWeights() {
    return Object.fromEntries(this.regimeWeights);
  }
}

module.exports = AdaptiveAEGIS;
