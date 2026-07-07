/**
 * SAINT V46 — ECOSYSTEM ORCHESTRATOR
 * ----------------------------------
 * Central governance layer that resolves all subsystem outputs into one decision
 */

class EcosystemOrchestratorV46 {

  constructor(deps) {

    this.capital = deps.capital;
    this.execution = deps.execution;
    this.survival = deps.survival;
    this.adversarial = deps.adversarial;
    this.rotation = deps.rotation;
    this.evolution = deps.evolution;
    this.prediction = deps.prediction;
  }

  // =====================================================
  // GATHER SYSTEM STATE
  // =====================================================
  collect(context) {

    return {
      survival: this.survival.update(context),
      adversarial: this.adversarial.analyze(context),
      prediction: this.prediction.predict(context),
      allocation: this.rotation.rotate(context.capital || 1.0),
      capitalHealth: context.capitalHealth || 1.0
    };
  }

  // =====================================================
  // GOVERNANCE SCORING
  // =====================================================
  computeDecisionState(state) {

    const risk = state.adversarial.score;
    const survivalSafe = state.survival !== "HOSTILE";

    const predictionConfidence =
      state.prediction.confidence || 0;

    const stressPenalty =
      risk * 0.1;

    const safetyBoost =
      survivalSafe ? 0.3 : -0.5;

    const finalScore =
      predictionConfidence + safetyBoost - stressPenalty;

    return {
      finalScore,
      risk,
      survivalSafe
    };
  }

  // =====================================================
  // DECISION POLICY ENGINE
  // =====================================================
  decide(state) {

    const decision = this.computeDecisionState(state);

    // -------------------------
    // HARD BLOCK
    // -------------------------
    if (!decision.survivalSafe || decision.risk > 10) {
      return {
        action: "HOLD",
        reason: "SYSTEM_SURVIVAL_LOCK",
        decision
      };
    }

    // -------------------------
    // REDUCED ACTIVITY
    // -------------------------
    if (decision.finalScore < 0.4) {
      return {
        action: "REDUCE_EXPOSURE",
        reason: "LOW_CONFIDENCE_STATE",
        decision
      };
    }

    // -------------------------
    // NORMAL OPERATION
    // -------------------------
    if (decision.finalScore >= 0.4 && decision.finalScore < 0.75) {
      return {
        action: "SELECTIVE_EXECUTION",
        reason: "MODERATE_CONFIDENCE",
        decision
      };
    }

    // -------------------------
    // AGGRESSIVE OPERATION
    // -------------------------
    return {
      action: "FULL_EXECUTION",
      reason: "HIGH_CONFIDENCE_STATE",
      decision
    };
  }

  // =====================================================
  // EXECUTION PIPELINE
  // =====================================================
  run(order, context) {

    const state = this.collect(context);

    const decision = this.decide(state);

    // ROUTE THROUGH EXECUTION CONTROL (V40)
    const executionResult =
      this.execution.execute(order, context);

    return {
      decision,
      state,
      executionResult,
      timestamp: Date.now()
    };
  }
}

module.exports = EcosystemOrchestratorV46;
