/**
 * SAINT V28 — REINFORCEMENT LEARNING EXECUTION LOOP
 * -------------------------------------------------
 * Converts execution outcomes into policy rewards
 */

class ExecutionRLV28 {

  constructor() {

    this.episodes = [];
    this.policyWeights = {
      pnl: 1.0,
      slippage: -1.5,
      drawdown: -2.0,
      flowAlignment: 0.8,
      toxicityPenalty: -1.2,
      regimeBonus: 0.5
    };
  }

  // =====================================================
  // COMPUTE REWARD FUNCTION
  // =====================================================
  computeReward(execution) {

    const pnl = execution.pnl || 0;
    const slippage = execution.slippage || 0;
    const drawdown = execution.drawdown || 0;

    const flowAlignment =
      execution.flowState === "ACCUMULATION" ? 1 :
      execution.flowState === "DISTRIBUTION" ? -1 : 0;

    const toxicityPenalty =
      execution.toxicity > 0.6 ? -1 : 0;

    const regimeBonus =
      execution.regime === "TRENDING" ? 1 : 0.2;

    const reward =
      (pnl * this.policyWeights.pnl) +
      (slippage * this.policyWeights.slippage) +
      (drawdown * this.policyWeights.drawdown) +
      (flowAlignment * this.policyWeights.flowAlignment) +
      (toxicityPenalty * this.policyWeights.toxicityPenalty) +
      (regimeBonus * this.policyWeights.regimeBonus);

    return reward;
  }

  // =====================================================
  // STORE EPISODE
  // =====================================================
  record(execution) {

    const reward = this.computeReward(execution);

    this.episodes.push({
      ...execution,
      reward
    });

    return reward;
  }

  // =====================================================
  // POLICY UPDATE (SIMPLE GRADIENT-STYLE ADJUSTMENT)
  // =====================================================
  updatePolicy() {

    if (this.episodes.length < 10) return this.policyWeights;

    const recent = this.episodes.slice(-50);

    let avgReward = 0;

    for (const e of recent) {
      avgReward += e.reward;
    }

    avgReward /= recent.length;

    // -------------------------
    // ADJUST WEIGHTS BASED ON SIGNAL
    // -------------------------
    if (avgReward > 0) {

      this.policyWeights.pnl += 0.05;
      this.policyWeights.slippage += 0.02; // tolerate slightly more if profitable flow
    } else {

      this.policyWeights.pnl -= 0.05;
      this.policyWeights.slippage -= 0.05;
      this.policyWeights.toxicityPenalty -= 0.05;
    }

    // clamp
    for (const k in this.policyWeights) {
      this.policyWeights[k] =
        Math.max(-3, Math.min(3, this.policyWeights[k]));
    }

    return this.policyWeights;
  }

  // =====================================================
  // BEST ACTION SIGNAL
  // =====================================================
  evaluate(execution) {

    const reward = this.record(execution);
    const weights = this.updatePolicy();

    let confidence = Math.tanh(reward / 10);

    return {
      reward,
      confidence,
      weights
    };
  }

  // =====================================================
  // POLICY SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      weights: this.policyWeights,
      episodes: this.episodes.length
    };
  }
}

module.exports = ExecutionRLV28;
