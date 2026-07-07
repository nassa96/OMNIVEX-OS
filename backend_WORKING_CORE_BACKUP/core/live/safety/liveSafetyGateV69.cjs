/**
 * SAINT V69 — LIVE SAFETY GATE
 * Prevents catastrophic execution
 */

class LiveSafetyGateV69 {

  constructor(maxRisk = 0.7) {
    this.maxRisk = maxRisk;
  }

  allow(signal) {

    const risk = signal.risk || 0;

    if (risk > this.maxRisk) return false;

    if (!signal.symbol || !signal.side) return false;

    return true;
  }
}

module.exports = LiveSafetyGateV69;
