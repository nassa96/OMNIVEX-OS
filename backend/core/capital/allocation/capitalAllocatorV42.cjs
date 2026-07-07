/**
 * SAINT V42 — CAPITAL ALLOCATION SURVIVAL OPTIMIZER
 * --------------------------------------------------
 * Dynamically adjusts exposure based on system-wide intelligence
 */

class CapitalAllocatorV42 {

  constructor() {

    this.baseRisk = 1.0;

    this.limits = {
      min: 0.05,
      max: 2.5
    };
  }

  // =====================================================
  // CALCULATE SURVIVAL SCORE
  // =====================================================
  survivalScore(context) {

    const {
      regimeSafe = 1,
      adversarialScore = 0,
      predictionConfidence = 0.5,
      liquidityStress = 0,
      executionSafety = 1
    } = context;

    let score = 1.0;

    // -------------------------
    // REGIME FACTOR (V41)
    // -------------------------
    score *= regimeSafe ? 1.2 : 0.3;

    // -------------------------
    // ADVERSARIAL PENALTY (V39)
    // -------------------------
    score *= Math.max(0.2, 1 - adversarialScore / 15);

    // -------------------------
    // PREDICTION BOOST (V35–V38)
    // -------------------------
    score *= (0.5 + predictionConfidence);

    // -------------------------
    // LIQUIDITY STRESS PENALTY (V33)
    // -------------------------
    score *= Math.max(0.3, 1 - liquidityStress);

    // -------------------------
    // EXECUTION SAFETY (V40)
    // -------------------------
    score *= executionSafety;

    return score;
  }

  // =====================================================
  // ALLOCATE CAPITAL
  // =====================================================
  allocate(context, capital = 1.0) {

    const score = this.survivalScore(context);

    let allocation = capital * score;

    // clamp exposure
    allocation = Math.max(this.limits.min, allocation);
    allocation = Math.min(this.limits.max, allocation);

    return {
      allocatedCapital: allocation,
      score,
      raw: capital
    };
  }

  // =====================================================
  // POSITION SIZING ENGINE
  // =====================================================
  sizeOrder(order, allocationResult) {

    const adjusted = { ...order };

    adjusted.size = order.size * allocationResult.allocatedCapital;

    adjusted.riskMultiplier = allocationResult.score;

    return adjusted;
  }

  // =====================================================
  // FULL CAPITAL DECISION PIPELINE
  // =====================================================
  process(order, context) {

    const allocation = this.allocate(context);

    const sizedOrder = this.sizeOrder(order, allocation);

    return {
      allocation,
      sizedOrder,
      timestamp: Date.now()
    };
  }
}

module.exports = CapitalAllocatorV42;
