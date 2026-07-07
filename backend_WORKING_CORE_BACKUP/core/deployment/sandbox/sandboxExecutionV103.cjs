/**
 * SAINT V103 — SANDBOX EXECUTION ENGINE
 */

class SandboxExecutionV103 {

  execute(order) {

    const fakeFillPrice =
      order.price + (Math.random() - 0.5) * 2;

    return {
      status: "SANDBOX_FILLED",
      fillPrice: fakeFillPrice,
      slippage: Math.abs(fakeFillPrice - order.price),
      ts: Date.now()
    };
  }
}

module.exports = SandboxExecutionV103;
