/**
 * SAINT V27 — Adaptive Execution Controller
 * -----------------------------------------
 * Central arbitration layer:
 *
 * Inputs:
 *  - cognition (V25)
 *  - memory feedback (V26)
 *  - risk gate
 *  - execution router
 *
 * Output:
 *  - final execution directive
 */

class AdaptiveController {
  constructor({ memory, riskGate, executor }) {
    this.memory = memory;
    this.riskGate = riskGate;
    this.executor = executor;

    this.state = {
      aggression: 1.0,
      lastRegime: "NORMAL"
    };
  }

  /**
   * Adjust system aggressiveness based on learned execution quality
   */
  adaptFromMemory() {
    const feedback = this.memory.feedbackSignal();

    // degrade aggressiveness in bad regimes
    if (feedback.regime === "TOXIC_LIQUIDITY") {
      this.state.aggression = 0.4;
    } else if (feedback.regime === "FAST_MARKET") {
      this.state.aggression = 0.6;
    } else if (feedback.regime === "BROKEN_FLOW") {
      this.state.aggression = 0.2;
    } else {
      this.state.aggression = 1.0;
    }

    this.state.lastRegime = feedback.regime;
  }

  /**
   * Modify signal based on learned system state
   */
  adjustSignal(cognition) {
    const adjusted = { ...cognition };

    // Slippage penalty → reduce size
    if (cognition.slippage > 0.4) {
      adjusted.sizeMultiplier = (adjusted.sizeMultiplier || 1) * 0.5;
    }

    // Adverse selection penalty → delay execution
    if (cognition.adverse > 0.6) {
      adjusted.defer = true;
    }

    // Low execution quality → reduce aggressiveness
    if (cognition.executionQuality < 0.5) {
      adjusted.sizeMultiplier = (adjusted.sizeMultiplier || 1) * 0.7;
    }

    return adjusted;
  }

  /**
   * Final decision pipeline
   */
  execute(cognition, market) {

    this.adaptFromMemory();

    // 1. memory-aware adjustment
    const adjusted = this.adjustSignal(cognition);

    // 2. risk gate check
    const risk = this.riskGate.evaluate(adjusted, market);
    if (risk === "BLOCK") {
      return {
        status: "BLOCKED",
        reason: "risk_gate",
        regime: this.state.lastRegime
      };
    }

    // 3. execution deferral logic
    if (adjusted.defer) {
      return {
        status: "DEFERRED",
        reason: "adverse_selection",
        regime: this.state.lastRegime
      };
    }

    // 4. execution routing
    const execution = this.executor.execute(adjusted, market);

    return {
      status: "EXECUTED",
      execution,
      regime: this.state.lastRegime,
      aggression: this.state.aggression
    };
  }
}

module.exports = AdaptiveController;
