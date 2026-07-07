class SmartExecutionRouter {
  constructor(exchangeAdapter, intelligence) {
    this.adapter = exchangeAdapter;
    this.intel = intelligence;

    this.exchanges = ["binance", "coinbase", "kraken"];
  }

  route(order, marketContext = {}) {

    // -----------------------------------
    // 1. SELECT BEST EXCHANGE
    // -----------------------------------
    const exchange = this.intel.getBestExchange();

    // -----------------------------------
    // 2. EXECUTE ORDER
    // -----------------------------------
    const start = Date.now();

    const result = this.adapter.execute(exchange, order);

    const latency = Date.now() - start;

    // -----------------------------------
    // 3. SIMULATED FILL METRICS
    // -----------------------------------
    const slippage =
      (result.price - order.price) / order.price;

    const filled = result.status === "EXECUTED";

    // -----------------------------------
    // 4. LEARN FROM EXECUTION
    // -----------------------------------
    this.intel.record(exchange, {
      slippage,
      latency,
      filled
    });

    return {
      ...result,
      exchange,
      slippage,
      latency
    };
  }
}

module.exports = SmartExecutionRouter;
