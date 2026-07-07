/**
 * SAINT V84 — WATCHDOG
 */

class SystemWatchdogV84 {

  constructor() {
    this.failures = 0;
  }

  tick(success) {

    if (!success) this.failures++;
    else this.failures = 0;

    return {
      healthy: this.failures < 5,
      failures: this.failures
    };
  }
}

module.exports = SystemWatchdogV84;
