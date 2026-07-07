class AEGIS {
  constructor(state) {
    this.state = state;

    this.limits = {
      maxVolatility: 15,
      maxTicksPerSecond: 10,
      killSwitch: false
    };

    this.tickHistory = [];
  }

  registerTick(tick) {
    const now = Date.now();

    this.tickHistory.push(now);

    // keep last 1s window
    this.tickHistory = this.tickHistory.filter(t => now - t < 1000);

    if (this.tickHistory.length > this.limits.maxTicksPerSecond) {
      this.limits.killSwitch = true;
      this.state.status = "AEGIS_KILL_SWITCH_TRIGGERED";
    }
  }

  allowExecution(entry) {
    if (this.limits.killSwitch) {
      return {
        allowed: false,
        reason: "KILL_SWITCH_ACTIVE"
      };
    }

    if (entry.meta?.volatility > this.limits.maxVolatility) {
      return {
        allowed: false,
        reason: "VOLATILITY_BREACH"
      };
    }

    return {
      allowed: true,
      reason: "OK"
    };
  }

  reset() {
    this.limits.killSwitch = false;
    this.tickHistory = [];
    this.state.status = "AEGIS_RESET";
  }
}

module.exports = AEGIS;
