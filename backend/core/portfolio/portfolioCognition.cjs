class PortfolioCognition {
  constructor(capital = 10000) {
    this.capital = capital;

    this.positions = new Map();   // symbol -> exposure
    this.returns = new Map();     // symbol -> performance history
    this.correlation = new Map(); // symbol pair correlations
  }

  updatePosition(symbol, value) {
    const current = this.positions.get(symbol) || 0;
    this.positions.set(symbol, current + value);
  }

  getTotalExposure() {
    let total = 0;
    for (const v of this.positions.values()) {
      total += Math.abs(v);
    }
    return total;
  }

  getExposureRatio() {
    return this.getTotalExposure() / this.capital;
  }

  // ---------------------------------------
  // 1. SIMPLE CORRELATION ESTIMATOR
  // (execution-driven, not statistical heavy)
  // ---------------------------------------
  updateCorrelation(symbolA, symbolB, moveA, moveB) {
    const key = `${symbolA}:${symbolB}`;

    if (!this.correlation.has(key)) {
      this.correlation.set(key, {
        score: 0,
        count: 0
      });
    }

    const entry = this.correlation.get(key);

    const alignment = moveA * moveB > 0 ? 1 : -1;

    entry.score = (entry.score * entry.count + alignment) / (entry.count + 1);
    entry.count += 1;

    this.correlation.set(key, entry);
  }

  getCorrelation(symbolA, symbolB) {
    return this.correlation.get(`${symbolA}:${symbolB}`)?.score || 0;
  }

  // ---------------------------------------
  // 2. SYSTEM RISK SCORE
  // ---------------------------------------
  getSystemRisk() {
    const exposure = this.getTotalExposure();

    let correlationRisk = 0;
    let pairs = 0;

    const symbols = Array.from(this.positions.keys());

    for (let i = 0; i < symbols.length; i++) {
      for (let j = i + 1; j < symbols.length; j++) {
        correlationRisk += Math.abs(
          this.getCorrelation(symbols[i], symbols[j])
        );
        pairs++;
      }
    }

    correlationRisk = pairs ? correlationRisk / pairs : 0;

    return {
      exposureRatio: exposure / this.capital,
      correlationRisk,
      systemHeat: (exposure / this.capital) * (1 + correlationRisk)
    };
  }

  // ---------------------------------------
  // 3. CAPITAL ALLOCATION SCORE
  // ---------------------------------------
  getAllocationScore(symbol, volatility, momentum) {
    const exposure = this.positions.get(symbol) || 0;

    const underexposed = 1 - (Math.abs(exposure) / this.capital);

    const score =
      underexposed * 0.5 +
      momentum * 0.3 +
      (1 - volatility) * 0.2;

    return score;
  }
}

module.exports = PortfolioCognition;
