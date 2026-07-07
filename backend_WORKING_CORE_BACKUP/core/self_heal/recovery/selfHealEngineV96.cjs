/**
 * SAINT V96 — SELF HEAL ENGINE
 */

class SelfHealEngineV96 {

  constructor(circuitBreaker) {
    this.circuitBreaker = circuitBreaker;
  }

  recover(state) {

    if (!this.circuitBreaker.allow()) {
      return {
        status: "BLOCKED_BY_CIRCUIT_BREAKER"
      };
    }

    if (state.anomalyScore > 0.8) {
      this.circuitBreaker.recordFailure();

      return {
        status: "RECOVERY_TRIGGERED",
        action: "ROLLBACK_STATE"
      };
    }

    return {
      status: "HEALTHY"
    };
  }
}

module.exports = SelfHealEngineV96;
