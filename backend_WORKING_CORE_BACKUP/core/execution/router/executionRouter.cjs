const SmartOrderRouter = require("./smartOrderRouter.cjs");

/**
 * SAINT V13 — ROUTER (UPDATED FOR EXECUTION ENGINE)
 */

class ExecutionRouter {

  constructor() {
    this.router = new SmartOrderRouter();
  }

  route(signal, venues) {

    return this.router.route(signal, venues);
  }
}

module.exports = ExecutionRouter;
