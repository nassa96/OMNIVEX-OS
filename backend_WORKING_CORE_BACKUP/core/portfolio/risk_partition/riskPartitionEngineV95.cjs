/**
 * SAINT V95 — RISK PARTITION ENGINE
 */

class RiskPartitionEngineV95 {

  evaluate(shard, order) {

    const baseRisk = order.risk || 0;

    const multiplier = shard === "experimental" ? 1.5
                     : shard === "aggressive" ? 1.2
                     : 0.7;

    const adjustedRisk = baseRisk * multiplier;

    return {
      shard,
      adjustedRisk,
      approved: adjustedRisk < 0.85
    };
  }
}

module.exports = RiskPartitionEngineV95;
