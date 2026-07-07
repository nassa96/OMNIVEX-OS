class ExecutionEngine {
  execute(signal) {
    if (!signal) return null;

    return {
      action: signal.action || "HOLD",
      confidence: signal.confidence || 0,
      timestamp: Date.now()
    };
  }

  getStatus() {
    return { status: "ONLINE" };
  }
}

module.exports = new ExecutionEngine();
