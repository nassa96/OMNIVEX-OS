/**
 * SAINT V102 — FUND RUNTIME ENGINE
 */

class FundRuntimeV102 {

  constructor(governor, executor) {
    this.governor = governor;
    this.executor = executor;
  }

  async tick(order) {

    const decision = this.governor.approve(order);

    if (!decision.approved) {
      return decision;
    }

    return await this.executor.execute(order);
  }
}

module.exports = FundRuntimeV102;
