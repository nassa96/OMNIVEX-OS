/**
 * SAINT — Execution Intelligence Layer
 * Canonical Contract v1
 */

class SAINT {
  constructor() {
    this.mode = "CANONICAL_EXECUTION";
    this.confidence = 0.5;
  }

  evaluate(state) {
    // deterministic scoring instead of randomness
    const volatility = Math.abs(state.equityDelta || 0);

    if (volatility > 1.5) {
      this.confidence = 0.2;
      return {
        action: "DE_RISK",
        confidence: this.confidence
      };
    }

    if (state.equity > 1000) {
      this.confidence = 0.8;
      return {
        action: "SCALE_UP",
        confidence: this.confidence
      };
    }

    this.confidence = 0.5;
    return {
      action: "HOLD",
      confidence: this.confidence
    };
  }
}

module.exports = new SAINT();
