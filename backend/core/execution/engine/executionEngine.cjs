class ExecutionEngine {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async execute(signal) {
    if (!signal || signal.type !== "SIGNAL") return null;

    console.log("[EXEC ENGINE] received", signal);

    return this.adapter.placeOrder(signal.data);
  }
}

module.exports = ExecutionEngine;
