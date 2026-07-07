class ExecutionRouter {
  execute(decision, market) {
    if (decision === "BLOCK") {
      return {
        status: "SKIPPED",
        reason: "risk_gate",
        slippage: 0,
        pnl: 0
      };
    }

    const slippage = (Math.random() * 0.6).toFixed(4);

    const pnl = decision === "BUY"
      ? (Math.random() - 0.5)
      : (Math.random() - 0.6);

    return {
      status: "EXECUTED",
      side: decision,
      price: market.price,
      slippage: parseFloat(slippage),
      pnl: parseFloat(pnl),
      ts: Date.now()
    };
  }
}

module.exports = ExecutionRouter;
