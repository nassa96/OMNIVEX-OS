/**
 * SAINT V73 — STATE SYNC ENGINE
 * Synchronizes internal + external system states
 */

class StateSyncV73 {

  sync(local, remote) {

    return {
      synced: local.id === remote.id,
      delta: {
        pnl: (remote.pnl || 0) - (local.pnl || 0),
        statusMismatch: local.status !== remote.status
      }
    };
  }
}

module.exports = StateSyncV73;
