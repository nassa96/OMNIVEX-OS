/**
 * SAINT V92 — COMPLIANCE GATE
 */

class ComplianceGateV92 {

  constructor(policy, audit) {
    this.policy = policy;
    this.audit = audit;
  }

  check(order) {

    const result = this.policy.evaluate(order);

    this.audit.record({
      order,
      result
    });

    return result;
  }
}

module.exports = ComplianceGateV92;
