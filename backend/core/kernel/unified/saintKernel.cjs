const CapitalRebalancer = require("../../market/allocation/capitalRebalancer.cjs");

class SaintKernel {

  constructor({ riskGate, executor, positionEngine }) {
    this.riskGate = riskGate;
    this.executor = executor;
    this.positions = positionEngine;

    this.rebalancer = new CapitalRebalancer(this.positions);

    this.tradeId = 0;
  }

  run(registry) {

    const books = registry.snapshotAll();
    const base = books.binance;

    const venue = ["binance", "coinbase", "kraken"][
      Math.floor(Math.random() * 3)
    ];

    const regime = "NORMAL";

    // ---------------------------
    // V40 CAPITAL ALLOCATION
    // ---------------------------
    const allocation = this.rebalancer.allocate(venue, regime);

    const price = base.mid || 50000;

    const position = this.positions.open({
      id: `T_${this.tradeId++}`,
      symbol: "BTC",
      size: allocation.allocation / price,
      entryPrice: price,
      venue,
      regime
    });

    const exitPrice = price + (Math.random() * 100 - 50);

    const closed = this.positions.close(position.id, exitPrice);

    return {
      status: "EXECUTED",
      venue,
      regime,
      allocation,
      position: closed
    };
  }
}

module.exports = CapitalRebalancer;
