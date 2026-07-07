/**
 * SAINT V25 — Execution Cognition Layer
 * -------------------------------------
 * Combines:
 * - Microstructure signal interpretation
 * - Slippage estimation
 * - Liquidity quality scoring
 * - Adverse selection detection
 * - Execution routing recommendation
 */

class ExecutionCognition {
  constructor() {
    this.history = [];
  }

  /**
   * Estimate spread pressure / liquidity stress
   */
  liquidityScore(market) {
    const bidDepth = (market.bids || []).length || 1;
    const askDepth = (market.asks || []).length || 1;

    const imbalance = Math.abs(bidDepth - askDepth) / (bidDepth + askDepth);

    return Math.max(0, 1 - imbalance); // 1 = healthy liquidity
  }

  /**
   * Simple slippage model (realism proxy)
   */
  estimateSlippage(market, size = 1) {
    const volatility = Math.abs(Math.sin((market.price || 1) / 10000));
    const liquidityPenalty = 1 / ((market.bids?.length || 1) + (market.asks?.length || 1));

    return volatility * size * liquidityPenalty;
  }

  /**
   * Adverse selection risk (fast move detection proxy)
   */
  adverseSelectionRisk(market) {
    const drift = Math.abs(market.price - (this.lastPrice || market.price));
    this.lastPrice = market.price;

    return Math.min(1, drift / 100);
  }

  /**
   * Core cognition engine
   */
  evaluate(signal, market) {
    const liquidity = this.liquidityScore(market);
    const slippage = this.estimateSlippage(market, 1);
    const adverse = this.adverseSelectionRisk(market);

    const executionQuality =
      (liquidity * 0.4) +
      ((1 - slippage) * 0.3) +
      ((1 - adverse) * 0.3);

    let decision = signal;

    // Hard filters
    if (executionQuality < 0.35) {
      decision = "BLOCK";
    }

    if (slippage > 0.6) {
      decision = "REDUCE_SIZE";
    }

    if (adverse > 0.7) {
      decision = "WAIT";
    }

    const result = {
      signal,
      market,
      liquidity,
      slippage,
      adverse,
      executionQuality,
      decision,
      ts: Date.now()
    };

    this.history.push(result);
    if (this.history.length > 200) this.history.shift();

    return result;
  }
}

module.exports = ExecutionCognition;
