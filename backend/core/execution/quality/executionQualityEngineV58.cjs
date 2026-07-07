/**
 * SAINT V58 — EXECUTION QUALITY ENGINE
 * Models execution outcome before and after fill
 */

class ExecutionQualityEngineV58 {

  constructor() {
    this.history = [];
  }

  // =====================================================
  // ESTIMATE SLIPPAGE
  // =====================================================
  estimateSlippage(market, signal) {

    const spread = market.liquidity?.spread || 0;
    const volatility = market.volatility || 0;

    const directionPenalty =
      signal.side === "BUY" ? market.askPressure || 0 :
      signal.side === "SELL" ? market.bidPressure || 0 : 0;

    return (spread * 0.5) + (volatility * 0.3) + directionPenalty;
  }

  // =====================================================
  // EXECUTION SCORE
  // =====================================================
  scoreExecution(expectedPrice, fillPrice, slippage) {

    const error = Math.abs(expectedPrice - fillPrice);

    const quality = 1 / (1 + error + slippage);

    return {
      error,
      quality
    };
  }

  // =====================================================
  // PRE-TRADE ASSESSMENT
  // =====================================================
  assess(market, signal) {

    const slippage = this.estimateSlippage(market, signal);

    let quality = "GOOD";
    if (slippage > 0.8) quality = "BAD";
    if (slippage > 1.5) quality = "UNTRADEABLE";

    return {
      slippage,
      quality,
      allowed: slippage < 1.5
    };
  }
}

module.exports = ExecutionQualityEngineV58;
