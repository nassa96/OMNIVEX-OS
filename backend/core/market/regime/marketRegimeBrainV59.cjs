/**
 * SAINT V59 — MARKET REGIME BRAIN
 * Controls system behavior based on market state
 */

class MarketRegimeBrainV59 {

  constructor() {
    this.state = "NEUTRAL";
  }

  detect(flow, orderflow, volatility) {

    const flowPressure = flow?.flowDelta || 0;
    const liquidity = orderflow?.strength || 0;

    let regime = "NEUTRAL";

    // =====================================================
    // TRENDING REGIME
    // =====================================================
    if (flowPressure > 0.6 && liquidity > 0.5) {
      regime = "TRENDING_BULL";
    }

    if (flowPressure < -0.6 && liquidity > 0.5) {
      regime = "TRENDING_BEAR";
    }

    // =====================================================
    // MANIPULATION REGIME
    // =====================================================
    if (volatility > 0.8 && liquidity < 0.3) {
      regime = "MANIPULATION";
    }

    // =====================================================
    // CHOP / MEAN REVERSION
    // =====================================================
    if (Math.abs(flowPressure) < 0.2 && volatility < 0.4) {
      regime = "CHOP";
    }

    this.state = regime;

    return {
      regime,
      confidence: Math.abs(flowPressure) + liquidity
    };
  }

  isTradeAllowed(regime) {

    if (regime === "MANIPULATION") return false;
    if (regime === "CHOP") return true;
    if (regime === "TRENDING_BULL") return true;
    if (regime === "TRENDING_BEAR") return true;

    return true;
  }
}

module.exports = MarketRegimeBrainV59;
