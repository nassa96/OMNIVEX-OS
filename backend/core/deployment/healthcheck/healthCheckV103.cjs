/**
 * SAINT V103 — HEALTH CHECK SYSTEM
 */

class HealthCheckV103 {

  check(systemState) {

    return {
      healthy: systemState.errorRate < 0.1,
      latencyOk: systemState.latency < 200,
      executionAllowed: true
    };
  }
}

module.exports = HealthCheckV103;
