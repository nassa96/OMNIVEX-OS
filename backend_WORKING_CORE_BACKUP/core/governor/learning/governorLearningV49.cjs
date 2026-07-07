/**
 * SAINT V49 — GOVERNOR LEARNING SYSTEM
 * ------------------------------------
 * Adjusts influence of each governor based on historical correctness
 */

class GovernorLearningV49 {

  constructor(initialGovernors = {}) {

    this.governors = {};

    for (const name in initialGovernors) {

      this.governors[name] = {
        correct: 0,
        incorrect: 0,
        weight: 1.0,
        history: []
      };
    }
  }

  // =====================================================
  // LOG DECISION OUTCOME
  // =====================================================
  logOutcome(name, decision, outcome) {

    if (!this.governors[name]) return;

    const profit = outcome.pnl || 0;

    const correct = profit > 0;

    this.governors[name].history.push({
      decision,
      pnl: profit,
      correct,
      ts: Date.now()
    });

    if (correct) {
      this.governors[name].correct++;
    } else {
      this.governors[name].incorrect++;
    }

    if (this.governors[name].history.length > 500) {
      this.governors[name].history.shift();
    }
  }

  // =====================================================
  // UPDATE GOVERNOR WEIGHTS
  // =====================================================
  updateWeights() {

    for (const name in this.governors) {

      const g = this.governors[name];

      const total = g.correct + g.incorrect || 1;

      const accuracy = g.correct / total;

      const recent = g.history.slice(-50);

      const recentAccuracy =
        recent.filter(h => h.correct).length / (recent.length || 1);

      // blend long + short term performance
      const blended = (accuracy * 0.6) + (recentAccuracy * 0.4);

      // amplify differences
      g.weight = Math.max(0.2, Math.min(2.5, blended * 2));
    }
  }

  // =====================================================
  // GET ACTIVE WEIGHTS
  // =====================================================
  getWeights() {

    const weights = {};

    for (const name in this.governors) {
      weights[name] = this.governors[name].weight;
    }

    return weights;
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      governors: this.governors
    };
  }
}

module.exports = GovernorLearningV49;
