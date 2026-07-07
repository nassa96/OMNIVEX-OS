/**
 * SAINT V50.2 — CLOSED LOOP CONSCIOUS ENGINE (CLEAN VERSION)
 */

class SaintConsciousLoopV50_2 {

  constructor({
    contextGovernor,
    driftDetector,
    learningSystem
  }) {
    this.contextGovernor = contextGovernor;
    this.driftDetector = driftDetector;
    this.learningSystem = learningSystem;
  }

  // =====================================================
  // MAIN LOOP
  // =====================================================
  run(state) {

    // 1. CONTEXT-AWARE GOVERNOR DECISION
    const decisionPack =
      this.contextGovernor.decide(state);

    // 2. SIMULATED EXECUTION RESULT
    const execution = {
      pnl: (Math.random() * 2 - 1),
      risk: state.adversarialScore || 0
    };

    // 3. LOG DRIFT + LEARNING FEEDBACK
    for (const v of (decisionPack.votes || [])) {

      this.driftDetector.log(
        v.name,
        decisionPack.context,
        execution.pnl
      );

      this.learningSystem.logOutcome(
        v.name,
        v.decision,
        execution
      );
    }

    this.learningSystem.updateWeights();

    // 4. DRIFT ANALYSIS PER GOVERNOR
    const driftReport = {};

    const governors = this.learningSystem.governors || {};

    for (const name of Object.keys(governors)) {
      driftReport[name] = this.driftDetector.detect(name);
    }

    return {
      context: decisionPack.context,
      decision: decisionPack,
      execution,
      driftReport
    };
  }
}

module.exports = SaintConsciousLoopV50_2;
