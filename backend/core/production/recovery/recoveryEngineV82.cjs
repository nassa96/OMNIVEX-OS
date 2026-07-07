/**
 * SAINT V82 — RECOVERY ENGINE
 * Auto-recovers system from degraded states
 */

class RecoveryEngineV82 {

  constructor() {
    this.state = "HEALTHY";
  }

  evaluate(systemState) {

    if (systemState.failures > 10) {
      this.state = "DEGRADED";
    }

    if (systemState.failures > 25) {
      this.state = "CRITICAL";
    }

    return this.state;
  }

  recover() {

    if (this.state === "CRITICAL") {
      return { action: "FULL_RESTART" };
    }

    if (this.state === "DEGRADED") {
      return { action: "THROTTLE_SYSTEM" };
    }

    return { action: "NO_ACTION" };
  }
}

module.exports = RecoveryEngineV82;
