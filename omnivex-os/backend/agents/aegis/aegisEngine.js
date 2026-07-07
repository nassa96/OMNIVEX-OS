function evaluateRisk(signal, market) {
  let approved = true;
  let reason = "OK";

  if (signal.confidence < 0.3) {
    approved = false;
    reason = "LOW_CONFIDENCE";
  }

  if (market.price <= 0) {
    approved = false;
    reason = "INVALID_MARKET";
  }

  return {
    type: "aegis.risk_check",
    approved,
    reason,
    ts: Date.now()
  };
}

module.exports = { evaluateRisk };
