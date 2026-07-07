const SmartExecutionRouterV34 =
  require("../core/routing/execution/smartExecutionRouterV34.cjs");

/**
 * SAINT V34 — ROUTER BRAIN WRAPPER
 */

class SmartRouterBrainV34 {

  constructor(liquidityBrain, exchangeBrain) {
    this.engine =
      new SmartExecutionRouterV34(liquidityBrain, exchangeBrain);
  }

  execute(order, context) {
    return this.engine.execute(order, context);
  }

  route(order, context) {
    return this.engine.route(order, context);
  }
}

module.exports = SmartRouterBrainV34;
