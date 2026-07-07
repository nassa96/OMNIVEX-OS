/**
 * SAINT V95 — ALLOCATION ENGINE
 */

class AllocationEngineV95 {

  constructor(shardManager) {
    this.shardManager = shardManager;
  }

  allocate(order) {

    const shard = order.strategy || "conservative";

    const allocation = this.shardManager.allocate(shard);

    return {
      order,
      allocation
    };
  }
}

module.exports = AllocationEngineV95;
