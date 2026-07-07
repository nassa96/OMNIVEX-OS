/**
 * CONSENSUS ENGINE V2
 */

class ConsensusEngine {
  run({ signal, risk, strategy }) {
    let decision = "HOLD";

    if (signal?.bias === "BULLISH" && risk?.risk !== "HIGH") {
      decision = "BUY";
    }

    if (signal?.bias === "BEARISH" && risk?.risk !== "HIGH") {
      decision = "SELL";
    }

    return {
      decision,
      confidence: 0.75,
      signal,
      risk,
      strategy
    };
  }
}

export const consensus = new ConsensusEngine();
