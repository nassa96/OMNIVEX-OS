const CapitalAllocatorV30 =
  require("../core/capital/allocation/capitalAllocatorV30.cjs");

/**
 * SAINT V30 — CAPITAL BRAIN WRAPPER
 */

class CapitalBrainV30 {

  constructor() {
    this.engine = new CapitalAllocatorV30();
  }

  update(agent, result) {
    this.engine.updatePerformance(agent, result);
  }

  allocate(totalCapital) {
    return this.engine.allocate(totalCapital);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = CapitalBrainV30;
