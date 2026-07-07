/**
 * SAINT V49 — WEIGHTED MULTI-GOVERNOR SYSTEM
 */

class MultiGovernorV49 {

  constructor(governors, learningSystem) {

    this.governors = governors;
    this.learning = learningSystem;
  }

  // =====================================================
  // RUN GOVERNOR VOTES
  // =====================================================
  evaluate(state) {

    const weights = this.learning.getWeights();

    const votes = [];

    for (const name in this.governors) {

      const gov = this.governors[name];

      const decision = gov.decide(state);

      votes.push({
        name,
        decision,
        weight: weights[name] || 1.0
      });
    }

    return votes;
  }

  // =====================================================
  // RESOLVE DECISION
  // =====================================================
  resolve(votes) {

    const score = {
      HOLD: 0,
      REDUCE_EXPOSURE: 0,
      SELECTIVE_EXECUTION: 0,
      FULL_EXECUTION: 0
    };

    for (const v of votes) {
      score[v.decision] += v.weight;
    }

    return score;
  }

  // =====================================================
  // FINAL DECISION
  // =====================================================
  decide(state) {

    const votes = this.evaluate(state);

    const score = this.resolve(votes);

    const finalAction = Object.entries(score)
      .sort((a, b) => b[1] - a[1])[0][0];

    return {
      votes,
      score,
      finalAction
    };
  }
}

module.exports = MultiGovernorV49;
