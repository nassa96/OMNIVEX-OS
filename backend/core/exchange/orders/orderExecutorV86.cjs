/**
 * SAINT V86 — ORDER EXECUTOR
 */

class OrderExecutorV86 {

  async execute(order) {

    return {
      executed: true,
      venue: order.venue,
      symbol: order.symbol,
      side: order.side,
      ts: Date.now()
    };
  }
}

module.exports = OrderExecutorV86;
