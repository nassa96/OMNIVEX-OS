/**
 * SAINT EXECUTION BRAIN (V23 + V24)
 * ----------------------------------
 * Unified system:
 * - Microstructure cognition (V23)
 * - Regime-aware liquidity interpretation
 * - Fill probability modeling
 * - Adverse selection detection
 * - Execution gating logic
 */

class ExecutionBrain {

  constructor() {
    this.history = [];

    this.state = {
      microstructure: null,
      execution: null,
      allowExecution: true
    };
  }

  /**
   * MAIN ENTRY POINT
   */
  evaluate({ market, orderbook, signal }) {

    const micro = this._microstructure(orderbook);
    const cognition = this._cognition(micro);
    const exec = this._executionModel(market, micro, signal);

    const allowExecution = exec.score > 0.55;

    const result = {
      microstructure: micro,
      cognition,
      execution: exec,
      allowExecution
    };

    this._store(result);
    this.state = result;

    return result;
  }

  /**
   * -----------------------------
   * V23 MICROSTRUCTURE LAYER
   * -----------------------------
   */
  _microstructure(orderbook = {}) {

    const bids = orderbook.bids || [];
    const asks = orderbook.asks || [];

    const bestBid = Math.max(...bids, 0);
    const bestAsk = Math.min(...asks, Infinity);

    const spread = (bestAsk === Infinity || bestBid === 0)
      ? 0
      : bestAsk - bestBid;

    const imbalance = this._imbalance(bids, asks);

    const liquidityPressure = this._liquidity(bids, asks);

    const sweep = spread > 30 && Math.abs(imbalance) > 0.7;

    const spoofRisk = spread > 25 && liquidityPressure < 0.2;

    return {
      spread,
      imbalance,
      liquidityPressure,
      sweep,
      spoofRisk
    };
  }

  /**
   * Orderbook imbalance
   */
  _imbalance(bids, asks) {
    const bidVol = bids.reduce((a, b) => a + b, 0);
    const askVol = asks.reduce((a, b) => a + b, 0);

    const total = bidVol + askVol || 1;

    return (bidVol - askVol) / total;
  }

  /**
   * Liquidity pressure estimator
   */
  _liquidity(bids, asks) {
    const depth = bids.length + asks.length;

    if (depth === 0) return 0;

    const pressure = Math.min(1, depth / 50);

    return pressure;
  }

  /**
   * -----------------------------
   * V24 COGNITION LAYER
   * -----------------------------
   */
  _cognition(micro) {

    let regime = "NEUTRAL";

    if (micro.imbalance > 0.3) regime = "BUY_PRESSURE";
    if (micro.imbalance < -0.3) regime = "SELL_PRESSURE";
    if (micro.sweep) regime = "LIQUIDITY_SWEEP";

    return {
      regime,
      strength: Math.abs(micro.imbalance)
    };
  }

  /**
   * -----------------------------
   * V24 EXECUTION MODEL
   * -----------------------------
   */
  _executionModel(market, micro, signal) {

    const fillProbability = this._fillProbability(micro);
    const adverseRisk = this._adverseRisk(micro);
    const liquidityFade = this._liquidityFade(micro);

    let score = 0;

    // signal contribution
    if (signal === "BULLISH") score += 0.3;
    if (signal === "BEARISH") score += 0.3;

    // execution quality
    score += fillProbability * 0.4;
    score -= adverseRisk * 0.5;
    score -= liquidityFade * 0.3;

    return {
      fillProbability,
      adverseRisk,
      liquidityFade,
      score: Math.max(0, Math.min(1, score))
    };
  }

  /**
   * Fill probability model
   */
  _fillProbability(micro) {
    let p = 0.5;

    if (micro.spread < 5) p += 0.2;
    if (micro.spread > 20) p -= 0.25;

    if (Math.abs(micro.imbalance) > 0.6) p += 0.15;

    p += micro.liquidityPressure * 0.2;

    return Math.max(0, Math.min(1, p));
  }

  /**
   * Adverse selection risk
   */
  _adverseRisk(micro) {
    let r = 0.3;

    if (micro.sweep) r += 0.4;
    if (micro.spoofRisk) r += 0.3;
    if (micro.spread > 25) r += 0.2;

    return Math.max(0, Math.min(1, r));
  }

  /**
   * Liquidity fade risk
   */
  _liquidityFade(micro) {
    let f = 0.5;

    if (micro.liquidityPressure < 0.2) f += 0.25;
    if (Math.abs(micro.imbalance) > 0.7) f += 0.2;

    if (micro.sweep) f += 0.2;

    return Math.max(0, Math.min(1, f));
  }

  /**
   * MEMORY
   */
  _store(result) {
    this.history.push({
      ...result,
      ts: Date.now()
    });

    if (this.history.length > 1000) {
      this.history.shift();
    }
  }
}

module.exports = ExecutionBrain;
