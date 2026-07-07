/**
 * SAINT V24 - Execution Intelligence Engine
 * Fill probability + adverse selection + timing optimization
 */

class ExecutionIntelligenceV24 {
  constructor() {
    this.history = [];

    this.state = {
      fillProbability: 0,
      adverseSelectionRisk: 0,
      liquidityFadeRisk: 0,
      executionScore: 0,
      allowExecution: true
    };
  }

  /**
   * MAIN ENTRY
   */
  evaluate({ market, microstructure, signal }) {
    const fillProbability = this._fillProbability(market, microstructure);
    const adverseRisk = this._adverseSelection(market, microstructure);
    const liquidityFade = this._liquidityFade(market, microstructure);

    const executionScore = this._score({
      fillProbability,
      adverseRisk,
      liquidityFade,
      signal
    });

    const allowExecution = executionScore > 0.55;

    const result = {
      fillProbability,
      adverseRisk,
      liquidityFade,
      executionScore,
      allowExecution
    };

    this._store(result);

    this.state = result;

    return result;
  }

  /**
   * Fill probability model
   * (simplified microstructure heuristic model)
   */
  _fillProbability(market, micro) {
    const spread = micro?.spread || 0;
    const imbalance = micro?.imbalance || 0;
    const liquidity = Math.abs(micro?.liquidityPressure || 0);

    let p = 0.5;

    // tighter spread = better fills
    if (spread < 5) p += 0.2;
    if (spread > 20) p -= 0.25;

    // strong imbalance = directional fill risk
    if (Math.abs(imbalance) > 0.6) p += 0.15;

    // liquidity supports fills
    p += liquidity * 0.2;

    return Math.max(0, Math.min(1, p));
  }

  /**
   * Adverse selection risk
   * (getting filled before price moves against you)
   */
  _adverseSelection(market, micro) {
    const spoof = micro?.spoofRisk || 0;
    const sweep = micro?.sweep || false;

    let risk = 0.3;

    if (spoof) risk += 0.4;
    if (sweep) risk += 0.3;

    if (micro?.spread > 25) risk += 0.2;

    return Math.max(0, Math.min(1, risk));
  }

  /**
   * Liquidity fade prediction
   * (orderbook disappearing before fill)
   */
  _liquidityFade(market, micro) {
    const pressure = micro?.liquidityPressure || 0;

    let fade = 0.5;

    if (Math.abs(pressure) < 0.1) fade += 0.2; // weak book
    if (Math.abs(pressure) > 0.7) fade += 0.25; // unstable imbalance

    if (micro?.sweep) fade += 0.2;

    return Math.max(0, Math.min(1, fade));
  }

  /**
   * Execution decision scoring
   */
  _score({ fillProbability, adverseRisk, liquidityFade, signal }) {
    let score = 0;

    // signal strength weighting
    if (signal === "BULLISH_MICROSTRUCTURE") score += 0.35;
    if (signal === "BEARISH_MICROSTRUCTURE") score += 0.35;
    if (signal === "NEUTRAL") score -= 0.2;

    score += fillProbability * 0.4;
    score -= adverseRisk * 0.5;
    score -= liquidityFade * 0.3;

    return Math.max(0, Math.min(1, score));
  }

  _store(result) {
    this.history.push({
      ...result,
      ts: Date.now()
    });

    if (this.history.length > 500) {
      this.history.shift();
    }
  }
}

module.exports = ExecutionIntelligenceV24;
