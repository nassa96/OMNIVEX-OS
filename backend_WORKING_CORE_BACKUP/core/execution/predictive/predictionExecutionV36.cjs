/**
 * SAINT V36 — PREDICTION-DRIVEN EXECUTION ENGINE
 * ----------------------------------------------
 * Uses V35 forecasts to optimize execution timing and routing
 */

class PredictionExecutionV36 {

  constructor(liquidityRouter, predictionEngine) {

    this.router = liquidityRouter;
    this.predictor = predictionEngine;
  }

  // =====================================================
  // DECIDE EXECUTION TIMING
  // =====================================================
  shouldExecute(context) {

    const forecast = this.predictor.forecast();

    const shiftConfidence =
      forecast.shifts.reduce((a, s) => a + s.probability, 0);

    const spoofRisk =
      forecast.spoofSignals.length;

    // -------------------------
    // HIGH SPOOF RISK = AVOID EXECUTION
    // -------------------------
    if (spoofRisk > 2) {
      return {
        execute: false,
        reason: "HIGH_SPOOF_RISK"
      };
    }

    // -------------------------
    // LOW CONFIDENCE SHIFT = WAIT
    // -------------------------
    if (shiftConfidence < 0.5) {
      return {
        execute: false,
        reason: "LOW_LIQUIDITY_DIRECTIONAL_CONFIDENCE"
      };
    }

    return {
      execute: true,
      reason: "VALIDATED_BY_PREDICTION_LAYER"
    };
  }

  // =====================================================
  // ADJUST ORDER STRATEGY
  // =====================================================
  adjustOrder(order, context) {

    const forecast = this.predictor.forecast();

    let adjusted = { ...order };

    // -------------------------
    // IF SUPPORT BUILDING -> AGGRESSIVE BUY
    // -------------------------
    const support = forecast.shifts.find(
      s => s.direction === "UP_SUPPORT"
    );

    if (support && support.probability > 0.6) {
      adjusted.size *= 1.2;
      adjusted.executionType = "AGGRESSIVE";
    }

    // -------------------------
    // IF RESISTANCE BUILDING -> REDUCE SIZE
    // -------------------------
    const resistance = forecast.shifts.find(
      s => s.direction === "DOWN_RESISTANCE"
    );

    if (resistance && resistance.probability > 0.6) {
      adjusted.size *= 0.7;
      adjusted.executionType = "PASSIVE";
    }

    return adjusted;
  }

  // =====================================================
  // EXECUTION PIPELINE
  // =====================================================
  execute(order, context) {

    const decision = this.shouldExecute(context);

    if (!decision.execute) {
      return {
        status: "SKIPPED",
        reason: decision.reason,
        timestamp: Date.now()
      };
    }

    const adjusted = this.adjustOrder(order, context);

    const routes = this.router.route(adjusted, context);

    const result = this.router.execute(adjusted, context);

    return {
      status: "EXECUTED",
      decision,
      adjusted,
      routes,
      result
    };
  }
}

module.exports = PredictionExecutionV36;
