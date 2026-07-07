/**
 * SAINT V93 — INSTITUTIONAL EXECUTION GOVERNOR
 * FINAL EXECUTION AUTHORITY
 */

class InstitutionalGovernorV93 {

  constructor({
    capitalGovernor,
    complianceGate,
    governancePolicy,
    killSwitch
  }) {

    this.capital = capitalGovernor;
    this.compliance = complianceGate;
    this.policy = governancePolicy;
    this.killSwitch = killSwitch;
  }

  approve(order) {

    const capitalCheck = this.capital.approve(order);
    if (!capitalCheck.approved) {
      return capitalCheck;
    }

    const complianceCheck = this.compliance.check(order);
    if (!complianceCheck.allowed) {
      return complianceCheck;
    }

    const govCheck = this.policy.approve(order, this.capital.status());
    if (!govCheck.approved) {
      return govCheck;
    }

    if (order.emergency === true) {
      return this.killSwitch.trigger("EMERGENCY_ORDER_BLOCKED");
    }

    return {
      approved: true,
      route: "EXECUTION_ALLOWED"
    };
  }
}

module.exports = InstitutionalGovernorV93;
