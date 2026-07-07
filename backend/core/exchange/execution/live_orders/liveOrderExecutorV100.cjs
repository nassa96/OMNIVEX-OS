/**
 * SAINT V100 — LIVE ORDER EXECUTOR
 */

class LiveOrderExecutorV100 {

  constructor(auth) {
    this.auth = auth;
  }

  async execute(order) {

    const signed = this.auth.sign(order);

    return {
      status: "LIVE_ORDER_SUBMITTED",
      order,
      signature: signed,
      ts: Date.now()
    };
  }
}

module.exports = LiveOrderExecutorV100;
