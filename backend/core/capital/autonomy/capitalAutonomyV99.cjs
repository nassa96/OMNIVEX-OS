/**
 * SAINT V99 — CAPITAL AUTONOMY ENGINE
 */

class CapitalAutonomyV99 {

  constructor(lifecycle, rebalancer) {
    this.lifecycle = lifecycle;
    this.rebalancer = rebalancer;
  }

  tick(pnl) {

    this.lifecycle.update(pnl);

    const allocation = this.rebalancer.rebalance(this.lifecycle);

    return {
      capital: this.lifecycle.capital,
      allocation
    };
  }
}

module.exports = CapitalAutonomyV99;
