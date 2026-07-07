class SAINT {
  constructor(state) {
    this.state = state;
  }

  execute(decision, tick) {
    const allowed = decision.signal !== "BLOCKED" &&
                    decision.signal !== "DISABLED";

    return {
      executed: allowed,
      action: allowed ? decision.signal : "HOLD",
      price: tick.price,
      reason: decision.reason,
      ts: Date.now()
    };
  }
}

module.exports = SAINT;
