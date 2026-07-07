/**
 * SAINT V27 — ADAPTIVE EXECUTION POLICY ENGINE
 * --------------------------------------------
 * Learns from V26 memory and modifies execution behavior
 */

class AdaptiveExecutionPolicyV27 {

  constructor(memoryBrain) {

    this.memory = memoryBrain;

    this.policy = {
      aggressiveness: 0.5,
      riskMultiplier: 1.0,
      flowSensitivity: 0.5,
      toxicityPenalty: 1.0,
      venueBias: {}
    };
  }

  // =====================================================
  // UPDATE POLICY FROM MEMORY
  // =====================================================
  updatePolicy() {

    const stats = this.memory.stats();

    const venue = stats.venue || {};
    const flow = stats.flow || {};
    const regime = stats.regime || {};

    // -------------------------
    // AGGRESSIVENESS ADJUSTMENT
    // -------------------------
    const avgPnL =
      Object.values(venue)
        .reduce((a, v) => a + (v.avgPnL || 0), 0);

    const avgSlippage =
      Object.values(venue)
        .reduce((a, v) => a + (v.avgSlippage || 0), 0);

    const performanceSignal = avgPnL - (avgSlippage * 5);

    if (performanceSignal > 0) {
      this.policy.aggressiveness += 0.05;
    } else {
      this.policy.aggressiveness -= 0.05;
    }

    // clamp
    this.policy.aggressiveness =
      Math.max(0.1, Math.min(1, this.policy.aggressiveness));

    // -------------------------
    // RISK MULTIPLIER
    // -------------------------
    const marketPenalty =
      regime.CHAOTIC?.avgPnL < 0 ? 0.8 : 1.0;

    this.policy.riskMultiplier *= marketPenalty;

    this.policy.riskMultiplier =
      Math.max(0.3, Math.min(1.2, this.policy.riskMultiplier));

    // -------------------------
    // FLOW SENSITIVITY
    // -------------------------
    if (flow.ACCUMULATION?.avgPnL > flow.DISTRIBUTION?.avgPnL) {
      this.policy.flowSensitivity += 0.05;
    } else {
      this.policy.flowSensitivity -= 0.05;
    }

    this.policy.flowSensitivity =
      Math.max(0.1, Math.min(1, this.policy.flowSensitivity));

    return this.policy;
  }

  // =====================================================
  // ADAPT SIGNAL
  // =====================================================
  adaptSignal(signal, context) {

    const policy = this.policy;

    let adjusted = { ...signal };

    // -------------------------
    // FLOW WEIGHTING
    // -------------------------
    if (context.flowState === "ACCUMULATION") {
      adjusted.confidence *= (1 + policy.flowSensitivity);
    }

    if (context.flowState === "DISTRIBUTION") {
      adjusted.confidence *= (1 - policy.flowSensitivity);
    }

    // -------------------------
    // TOXICITY PENALTY
    // -------------------------
    if (context.toxicity > 0.6) {
      adjusted.confidence *= (1 - policy.toxicityPenalty * 0.5);
    }

    // -------------------------
    // AGGRESSIVENESS SCALING
    // -------------------------
    adjusted.size *= policy.aggressiveness;

    // -------------------------
    // RISK ADJUSTMENT
    // -------------------------
    adjusted.size *= policy.riskMultiplier;

    return adjusted;
  }

  // =====================================================
  // VENUE PREFERENCE UPDATE
  // =====================================================
  venueScore(venueStats) {

    const scores = {};

    for (const v in venueStats) {

      const s = venueStats[v];

      scores[v] =
        s.avgPnL - (s.avgSlippage * 5);
    }

    return scores;
  }

  // =====================================================
  // POLICY SNAPSHOT
  // =====================================================
  snapshot() {

    return this.policy;
  }
}

module.exports = AdaptiveExecutionPolicyV27;
