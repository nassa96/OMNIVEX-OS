/**
 * ELOHIM SUPERVISOR KERNEL V2
 * SINGLE DECISION AUTHORITY
 */

function decide({ signal, regime, risk, confidence }) {

  // absolute safety override
  if (risk.drawdown > 0.3) {
    return { action: "HALT", reason: "DRAWDOWN_LIMIT" };
  }

  if (regime === "VOLATILE" && confidence < 0.75) {
    return { action: "NO_TRADE", reason: "VOLATILITY_BLOCK" };
  }

  if (signal === "HOLD") {
    return { action: "NO_TRADE", reason: "NO_EDGE" };
  }

  if (confidence > 0.8) {
    return { action: signal, reason: "HIGH_CONFIDENCE" };
  }

  return { action: "WAIT", reason: "LOW_CONFIDENCE" };
}

module.exports = {
  decide
};
