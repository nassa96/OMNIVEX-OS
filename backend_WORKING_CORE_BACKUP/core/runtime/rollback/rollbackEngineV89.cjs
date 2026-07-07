/**
 * SAINT V89 — ROLLBACK ENGINE
 */

class RollbackEngineV89 {

  constructor(snapshotEngine) {
    this.snapshots = snapshotEngine;
  }

  rollback() {

    const snap = this.snapshots.latest();

    if (!snap) {
      return { error: "NO_SNAPSHOT" };
    }

    return {
      status: "ROLLED_BACK",
      state: snap.state,
      ts: Date.now()
    };
  }
}

module.exports = RollbackEngineV89;
