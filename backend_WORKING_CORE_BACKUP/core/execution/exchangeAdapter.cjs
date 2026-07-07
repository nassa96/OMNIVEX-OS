class ExchangeAdapter {
  constructor(adapters = {}) {
    this.adapters = adapters;
  }

  execute(exchange, order) {
    const adapter = this.adapters[exchange];

    if (!adapter) {
      return {
        status: "FAILED",
        reason: "NO_ADAPTER",
        exchange
      };
    }

    return adapter.execute(order);
  }
}

module.exports = ExchangeAdapter;
