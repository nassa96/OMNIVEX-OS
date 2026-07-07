/**
 * SAINT V96 — SYSTEM MONITOR
 */

class SystemMonitorV96 {

  detect(anomalyScore) {

    return {
      healthy: anomalyScore < 0.7,
      anomalyScore
    };
  }
}

module.exports = SystemMonitorV96;
