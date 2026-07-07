/**
 * AEGIS EXECUTION FIREWALL
 * Blocks unsafe or low-confidence actions
 */

const STATE = {
  enabled: true,
  minConfidence: 0.65,
  maxRisk: "HIGH"
};

function evaluate(signal) {
  if (!STATE.enabled) {
    return { allowed: false, reason: "AEGIS_DISABLED" };
  }

  if (!signal) {
    return { allowed: false, reason: "NO_SIGNAL" };
  }

  if (signal.strength < STATE.minConfidence) {
    return { allowed: false, reason: "LOW_CONFIDENCE" };
  }

  if (signal.signal === "SELL" && signal.strength < 0.7) {
    return { allowed: false, reason: "RISK_BLOCK_SELL" };
  }

  return { allowed: true, reason: "PASS" };
}

function setAegis(params) {
  Object.assign(STATE, params);
}

module.exports = {
  evaluate,
  setAegis,
  STATE
};
