/**
 * SAINT V89 — RESILIENCE MANAGER
 */

class ResilienceManagerV89 {

  constructor(snapshotEngine, rollbackEngine) {
    this.snapshotEngine = snapshotEngine;
    this.rollbackEngine = rollbackEngine;
  }

  protect(state, fn) {

    this.snapshotEngine.create(state);

    try {

      return fn();

    } catch (err) {

      return this.rollbackEngine.rollback();
    }
  }
}

module.exports = ResilienceManagerV89;
