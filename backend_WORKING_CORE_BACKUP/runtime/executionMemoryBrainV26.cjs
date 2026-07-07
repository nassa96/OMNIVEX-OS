const ExecutionMemoryEngine =
  require("../core/memory/execution/executionMemoryEngine.cjs");

/**
 * SAINT V26 — EXECUTION MEMORY BRAIN
 */

class ExecutionMemoryBrainV26 {

  constructor() {
    this.engine = new ExecutionMemoryEngine();
  }

  record(execution) {
    this.engine.record(execution);
  }

  stats() {
    return {
      venue: this.engine.venueStats(),
      regime: this.engine.regimeStats(),
      flow: this.engine.flowStats(),
      score: this.engine.qualityScore(),
      bestVenue: this.engine.bestVenue()
    };
  }
}

module.exports = ExecutionMemoryBrainV26;
