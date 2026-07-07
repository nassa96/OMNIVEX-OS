/**
 * SOPHIA — SIGNAL ENGINE V2
 */

class SophiaEngine {
  run(symbol, fused) {
    const momentum = fused?.momentum || 0;
    const volatility = fused?.volatility || 0;

    const score = momentum - volatility * 0.5;

    return {
      symbol,
      score,
      bias:
        score > 0.3 ? "BULLISH" :
        score < -0.3 ? "BEARISH" :
        "NEUTRAL"
    };
  }
}

export const sophia = new SophiaEngine();
