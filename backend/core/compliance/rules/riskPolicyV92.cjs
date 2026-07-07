/**
 * SAINT V92 — RISK POLICY ENGINE
 */

class RiskPolicyV92 {

  evaluate(order) {

    if (order.risk > 0.9) {
      return { allowed: false, reason: "RISK_TOO_HIGH" };
    }

    if (order.symbol.includes("MEME")) {
      return { allowed: false, reason: "RESTRICTED_ASSET_CLASS" };
    }

    return { allowed: true };
  }
}

module.exports = RiskPolicyV92;
