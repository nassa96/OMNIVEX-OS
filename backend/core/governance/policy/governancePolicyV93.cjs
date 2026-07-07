/**
 * SAINT V93 — GOVERNANCE POLICY ENGINE
 */

class GovernancePolicyV93 {

  approve(order, capitalStatus) {

    if (capitalStatus.locked) {
      return { approved: false, reason: "CAPITAL_LOCKED" };
    }

    if (order.risk > 0.85) {
      return { approved: false, reason: "GOV_RISK_BLOCK" };
    }

    return { approved: true };
  }
}

module.exports = GovernancePolicyV93;
