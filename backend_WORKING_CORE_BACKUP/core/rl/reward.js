/**
 * RL REWARD ENGINE V1
 * Equity delta based reinforcement signal
 */

const RL = {
  history: [],

  // ===============================
  // CORE REWARD FUNCTION
  // ===============================
  computeReward(prevEquity, currentEquity, volatility = 1) {
    const delta = currentEquity - prevEquity;

    // normalize risk
    const riskAdjusted = delta / (volatility + 0.0001);

    const reward = {
      delta,
      riskAdjusted,
      timestamp: Date.now()
    };

    this.history.push(reward);

    // keep memory bounded
    if (this.history.length > 1000) {
      this.history.shift();
    }

    return reward;
  },

  // ===============================
  // LEARNING SIGNAL (FOR FUTURE USE)
  // ===============================
  getSignal() {
    if (this.history.length < 10) {
      return { trend: "INSUFFICIENT_DATA", strength: 0 };
    }

    const recent = this.history.slice(-20);
    const avg =
      recent.reduce((sum, r) => sum + r.riskAdjusted, 0) / recent.length;

    return {
      trend: avg > 0 ? "POSITIVE" : "NEGATIVE",
      strength: Math.min(1, Math.abs(avg))
    };
  }
};

module.exports = RL;
