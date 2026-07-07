const OrderLifecycleEngine = require("./orderLifecycleEngine.cjs");

/**
 * SAINT V11 — EXECUTION TRACKER
 * Bridges execution decisions → order lifecycle monitoring
 */

class ExecutionTracker {

  constructor() {
    this.engine = new OrderLifecycleEngine();
  }

  placeOrder(signal) {

    const order = this.engine.create({
      symbol: "BTC",
      side: signal.signal,
      qty: 0.01,
      price: signal.price || 0
    });

    this.engine.submit(order.id);
    this.engine.acknowledge(order.id);

    return order;
  }

  simulateFill(id, price, qty) {
    return this.engine.partialFill(id, qty, price);
  }

  report(id, marketPrice) {
    return this.engine.analyzeOrder(id, marketPrice);
  }
}

module.exports = ExecutionTracker;
