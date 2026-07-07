/**
 * SAINT V50 — CONTEXT GOVERNOR (FIXED + FINAL)
 */

class ContextGovernorV50 {

  constructor(governors) {
    this.governors = governors;
  }

  detectContext(state) {

    const { volatility, trendStrength, adversarialScore } = state;

    if (adversarialScore > 8) return "MANIPULATION";
    if (volatility > 0.7) return "HIGH_VOLATILITY";
    if (Math.abs(trendStrength) > 0.6) return "TRENDING";

    return "CHOP";
  }

  activeGovernors(context) {

    const map = {
      MANIPULATION: ["CONSERVATIVE", "CONTRARIAN"],
      HIGH_VOLATILITY: ["RISK_OFF", "CONSERVATIVE"],
      TRENDING: ["AGGRESSIVE", "ADAPTIVE"],
      CHOP: ["ADAPTIVE", "CONSERVATIVE"]
    };

    return map[context] || ["ADAPTIVE"];
  }

  // =====================================================
  // NEW: DECISION RESOLVER (THIS FIXES YOUR BUG)
  // =====================================================
  resolveVotes(votes) {

    const score = {
      HOLD: 0,
      REDUCE_EXPOSURE: 0,
      SELECTIVE_EXECUTION: 0,
      FULL_EXECUTION: 0
    };

    for (const v of votes) {
      score[v.decision] += v.weight;
    }

    const finalAction =
      Object.entries(score)
        .sort((a, b) => b[1] - a[1])[0][0];

    return { score, finalAction };
  }

  decide(state) {

    const context = this.detectContext(state);
    const active = this.activeGovernors(context);

    const votes = [];

    for (const name of active) {

      const gov = this.governors[name];
      if (!gov) continue;

      votes.push({
        name,
        decision: gov.decide(state),
        weight: 1
      });
    }

    const resolved = this.resolveVotes(votes);

    return {
      context,
      votes,
      ...resolved
    };
  }
}

module.exports = ContextGovernorV50;
