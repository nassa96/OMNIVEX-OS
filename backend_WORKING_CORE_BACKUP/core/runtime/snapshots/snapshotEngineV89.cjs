/**
 * SAINT V89 — SNAPSHOT ENGINE
 */

class SnapshotEngineV89 {

  constructor() {
    this.snapshots = [];
  }

  create(state) {

    const snapshot = {
      state: JSON.parse(JSON.stringify(state)),
      ts: Date.now()
    };

    this.snapshots.push(snapshot);

    return snapshot;
  }

  latest() {
    return this.snapshots[this.snapshots.length - 1];
  }
}

module.exports = SnapshotEngineV89;
