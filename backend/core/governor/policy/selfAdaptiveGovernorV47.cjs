/**
 * SAINT V47 — SELF-ADAPTIVE GOVERNOR
 * ----------------------------------
 * Evolves its own decision-making policy based on execution outcomes
 */

class SelfAdaptiveGovernorV47 {

  constructor() {

    // initial policy thresholds
    this.policy = {
      blockRisk: 10,
      reduceThreshold: 0.4,
      fullThreshold: 0.75
    };

    this.performanceLog = [];
  }

  // =====================================================
  // LOG OUTCOME OF DECISION
  // =====================================================
  log(decision, outcome) {

    this.performanceLog.push({
      decision,
      pnl: outcome.pnl || 0,
      risk: outcome.risk || 0,
      ts: Date.now()
    });

    if (this.performanceLog.length > 1000) {
      this.performanceLog.shift();
    }
  }

  // =====================================================
  // ANALYZE POLICY EFFECTIVENESS
  // =====================================================
  analyze() {

    const logs = this.performanceLog;

    if (logs.length < 50) {
      return { stable: true };
    }

    let holdGain = 0;
    let reduceGain = 0;
    let fullGain = 0;
    let selectiveGain = 0;

    let holdCount = 0;
    let reduceCount = 0;
    let fullCount = 0;
    let selectiveCount = 0;

    for (const l of logs) {

      const pnl = l.pnl;

      switch (l.decision) {

        case "HOLD":
          holdGain += pnl;
          holdCount++;
          break;

        case "REDUCE_EXPOSURE":
          reduceGain += pnl;
          reduceCount++;
          break;

        case "FULL_EXECUTION":
          fullGain += pnl;
          fullCount++;
          break;

        case "SELECTIVE_EXECUTION":
          selectiveGain += pnl;
          selectiveCount++;
          break;
      }
    }

    return {
      holdAvg: holdGain / (holdCount || 1),
      reduceAvg: reduceGain / (reduceCount || 1),
      fullAvg: fullGain / (fullCount || 1),
      selectiveAvg: selectiveGain / (selectiveCount || 1)
    };
  }

  // =====================================================
  // EVOLVE POLICY THRESHOLDS
  // =====================================================
  evolve() {

    const stats = this.analyze();

    // shift thresholds toward best-performing behavior

    const best = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])[0];

    if (!best) return this.policy;

    const bestMode = best[0];

    // adaptive tuning logic
    switch (bestMode) {

      case "fullAvg":
        this.policy.fullThreshold = Math.min(0.9, this.policy.fullThreshold + 0.02);
        break;

      case "selectiveAvg":
        this.policy.reduceThreshold = Math.max(0.2, this.policy.reduceThreshold - 0.02);
        break;

      case "holdAvg":
        this.policy.blockRisk = Math.max(5, this.policy.blockRisk - 0.5);
        break;

      case "reduceAvg":
        this.policy.reduceThreshold = Math.min(0.6, this.policy.reduceThreshold + 0.01);
        break;
    }

    return this.policy;
  }

  // =====================================================
  // DECISION USING EVOLVED POLICY
  // =====================================================
  decide(state) {

    const { risk, confidence } = state;

    if (risk >= this.policy.blockRisk) {
      return "HOLD";
    }

    if (confidence < this.policy.reduceThreshold) {
      return "REDUCE_EXPOSURE";
    }

    if (confidence >= this.policy.fullThreshold) {
      return "FULL_EXECUTION";
    }

    return "SELECTIVE_EXECUTION";
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      policy: this.policy,
      logSize: this.performanceLog.length
    };
  }
}

module.exports = SelfAdaptiveGovernorV47;
