/**
 * SAINT V40 — ADVERSARIAL-AWARE EXECUTION CONTROL
 * -----------------------------------------------
 * Controls execution based on market manipulation risk
 */

class ExecutionControlV40 {

  constructor(router, adversarialEngine) {

    this.router = router;
    this.adversarial = adversarialEngine;

    this.thresholds = {
      low: 3,
      medium: 6,
      high: 10
    };
  }

  // =====================================================
  // ASSESS MARKET SAFETY
  // =====================================================
  assessSafety(context) {

    const report = this.adversarial.analyze(context);

    const score = report.score;

    let level = "SAFE";

    if (score >= this.thresholds.high) {
      level = "HOSTILE";
    } else if (score >= this.thresholds.medium) {
      level = "UNSTABLE";
    } else if (score >= this.thresholds.low) {
      level = "SUSPICIOUS";
    }

    return {
      level,
      score,
      report
    };
  }

  // =====================================================
  // ADAPT ORDER BASED ON RISK
  // =====================================================
  adaptOrder(order, safety) {

    const adjusted = { ...order };

    switch (safety.level) {

      case "HOSTILE":
        adjusted.size *= 0;
        adjusted.status = "REJECTED";
        break;

      case "UNSTABLE":
        adjusted.size *= 0.4;
        adjusted.executionType = "PASSIVE_LIMIT";
        break;

      case "SUSPICIOUS":
        adjusted.size *= 0.7;
        adjusted.executionType = "REDUCED_RISK";
        break;

      case "SAFE":
        adjusted.executionType = "NORMAL";
        break;
    }

    return adjusted;
  }

  // =====================================================
  // EXECUTION DECISION ENGINE
  // =====================================================
  execute(order, context) {

    const safety = this.assessSafety(context);

    const adapted = this.adaptOrder(order, safety);

    // BLOCK EXECUTION IF REJECTED
    if (adapted.status === "REJECTED") {

      return {
        status: "BLOCKED",
        reason: "MARKET_HOSTILE",
        safety,
        timestamp: Date.now()
      };
    }

    // ROUTE SAFE ORDER
    const result = this.router.execute(adapted, context);

    return {
      status: "EXECUTED",
      safety,
      adapted,
      result,
      timestamp: Date.now()
    };
  }
}

module.exports = ExecutionControlV40;
