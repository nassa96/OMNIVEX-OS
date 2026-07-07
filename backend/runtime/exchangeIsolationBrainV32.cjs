const ExchangeIsolationV32 =
  require("../core/isolation/exchange/exchangeIsolationV32.cjs");

/**
 * SAINT V32 — ISOLATION BRAIN WRAPPER
 */

class ExchangeIsolationBrainV32 {

  constructor() {
    this.engine = new ExchangeIsolationV32();
  }

  latency(exchange, ms) {
    this.engine.updateLatency(exchange, ms);
  }

  risk(exchange, exposure) {
    this.engine.updateRisk(exchange, exposure);
  }

  canTrade(exchange, size) {
    return this.engine.canExecute(exchange, size);
  }

  order(exchange, order) {
    return this.engine.registerOrder(exchange, order);
  }

  fill(exchange, fill) {
    return this.engine.registerFill(exchange, fill);
  }

  status(exchange) {
    return this.engine.status(exchange);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = ExchangeIsolationBrainV32;
