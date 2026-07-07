/**
 * SAINT V69 — LIVE CAPITAL ENGINE
 * Production-grade capital activation layer
 */

class LiveCapitalEngineV69 {

  constructor(executor, riskGate) {
    this.executor = executor;
    this.riskGate = riskGate;
    this.active = false;
  }

  enable() {
    this.active = true;
  }

  disable() {
    this.active = false;
  }

  async execute(signal) {

    if (!this.active) {
      return { rejected: true, reason: "LIVE_MODE_DISABLED" };
    }

    const allowed = this.riskGate.allow(signal);

    if (!allowed) {
      return { rejected: true, reason: "RISK_BLOCK" };
    }

    return await this.executor.execute(signal);
  }
}

module.exports = LiveCapitalEngineV69;
