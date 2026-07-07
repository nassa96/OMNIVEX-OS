const AegisEngine = require("./aegisEngine.cjs");

/**
 * SAINT V16 — RISK GATE
 * Blocks unsafe execution BEFORE routing
 */

class RiskGate {

  constructor() {
    this.aegis = new AegisEngine();
  }

  validate(signal, portfolio, market) {

    const result =
      this.aegis.evaluate(signal, portfolio, market);

    if (!result.allowed) {

      console.log("[AEGIS BLOCK]", result);

      return {
        status: "BLOCKED",
        reason: result.reason,
        riskScore: result.riskScore
      };
    }

    return {
      status: "APPROVED",
      ...result
    };
  }
}

module.exports = RiskGate;
