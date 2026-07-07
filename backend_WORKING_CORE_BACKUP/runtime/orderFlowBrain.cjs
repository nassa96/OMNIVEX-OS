const OrderFlowEngine = require("../core/market/orderflow/orderFlowEngine.cjs");

/**
 * SAINT V21 — ORDER FLOW BRAIN
 */

class OrderFlowBrain {

  constructor() {
    this.engine = new OrderFlowEngine();
  }

  update(trade) {
    return this.engine.analyze(trade);
  }
}

module.exports = OrderFlowBrain;
