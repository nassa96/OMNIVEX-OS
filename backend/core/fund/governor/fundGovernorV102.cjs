/**
 * SAINT V102 — FUND GOVERNOR CORE
 */

class FundGovernorV102 {

  constructor({ capital, compliance, execution }) {
    this.capital = capital;
    this.compliance = compliance;
    this.execution = execution;
  }

  approve(order) {

    if (order.risk > 0.9) {
      return { approved: false, reason: "FUND_RISK_BLOCK" };
    }

    if (this.capital.locked) {
      return { approved: false, reason: "CAPITAL_LOCKED" };
    }

    return { approved: true };
  }
}

module.exports = FundGovernorV102;
