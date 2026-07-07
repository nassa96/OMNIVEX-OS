/**
 * SAINT V53 — AEGIS RISK GATE
 */

class AegisRiskV53 {

  evaluate(signal) {

    // basic safety constraints
    if (!signal || !signal.symbol) {
      return { block: true, reason: "INVALID_SIGNAL" };
    }

    if (signal.size > 1) {
      return { block: true, reason: "SIZE_TOO_LARGE" };
    }

    if (signal.leverage && signal.leverage > 3) {
      return { block: true, reason: "LEVERAGE_TOO_HIGH" };
    }

    return { block: false };
  }
}

module.exports = AegisRiskV53;
