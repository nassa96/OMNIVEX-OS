/**
 * SAINT V27 — Adaptive Execution Controller
 * -----------------------------------------
 * Central decision brain:
 * - V25 cognition (market + microstructure)
 * - V26 memory (learning + degradation signals)
 * - Risk gate enforcement
 * - Execution routing final authority
 */

class AdaptiveController {
  constructor({ memory, riskGate, executor }) {
    this.memory = memory;
    this.riskGate = riskGate;
    this.executor = executor;

    this.state = {
      aggression: 1.0,
      regime: "NORMAL"
    };
  }

  /**
   * Pull system-wide learned state from V26
   */
  syncMemoryState() {
    const feedback = this.memory.feedbackSignal();

    this.state.regime = feedback.regime;

    // Adaptive aggression tuning
    switch (feedback.regime) {
      case "TOXIC_LIQUIDITY":
        this.state.aggression = 0.35;
        break;

      case "FAST_MARKET":
        this.state.aggression = 0.6;
        break;

      case "BROKEN_FLOW":
        this.state.aggression = 0.2;
        break;

      default:
        this.state.aggression = 1.0;
    }
  }

  /**
   * Modify cognition output before execution
   */
  transformCognition(cognition) {
    const adjusted = { ...cognition };

    // Apply aggression scaling
    adjusted.sizeMultiplier =
      (adjusted.sizeMultiplier || 1) * this.state.aggression;

    // Slippage protection
    if (cognition.slippage > 0.35) {
      adjusted.sizeMultiplier *= 0.6;
    }

    // Adverse selection filter
    if (cognition.adverse > 0.6) {
      adjusted.defer = true;
    }

    // Weak execution environment suppression
    if (cognition.executionQuality < 0.45) {
      adjusted.sizeMultiplier *= 0.7;
    }

    return adjusted;
  }

  /**
   * Main decision pipeline
   */
  execute(cognition, market) {

    // 1. Sync learned state
    this.syncMemoryState();

    // 2. Transform signal using learned system state
    const adjusted = this.transformCognition(cognition);

    // 3. Risk enforcement (hard gate)
    const risk = this.riskGate.evaluate(adjusted, market);

    if (risk === "BLOCK") {
      return {
        status: "BLOCKED",
        reason: "risk_gate",
        regime: this.state.regime
      };
    }

    // 4. Execution delay logic
    if (adjusted.defer) {
      return {
        status: "DEFERRED",
        reason: "adverse_selection",
        regime: this.state.regime
      };
    }

    // 5. Execute final routing
    const execution = this.executor.execute(adjusted, market);

    return {
      status: "EXECUTED",
      execution,
      regime: this.state.regime,
      aggression: this.state.aggression
    };
  }
}

module.exports = AdaptiveController;
