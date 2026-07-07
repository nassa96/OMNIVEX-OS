const CapitalAllocatorV42 =
  require("../core/capital/allocation/capitalAllocatorV42.cjs");

/**
 * SAINT V42 — CAPITAL BRAIN WRAPPER
 */

class CapitalBrainV42 {

  constructor() {
    this.engine = new CapitalAllocatorV42();
  }

  process(order, context) {
    return this.engine.process(order, context);
  }
}

module.exports = CapitalBrainV42;
