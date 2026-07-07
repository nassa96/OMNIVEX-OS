/**
 * SAINT V104 — EXECUTION REPLAY ENGINE
 */

class ExecutionReplayV104 {

  constructor() {
    this.history = [];
  }

  record(event) {
    this.history.push(event);
  }

  replay() {
    return this.history;
  }
}

module.exports = ExecutionReplayV104;
