const ExchangeMemoryV31 =
  require("../core/memory/exchange/exchangeMemoryV31.cjs");

/**
 * SAINT V31 — EXCHANGE BRAIN WRAPPER
 */

class ExchangeBrainV31 {

  constructor() {
    this.engine = new ExchangeMemoryV31();
  }

  record(exchange, execution) {
    this.engine.record(exchange, execution);
  }

  select(context) {
    return this.engine.bestExchange(context);
  }

  snapshot() {
    return this.engine.snapshot();
  }
}

module.exports = ExchangeBrainV31;
