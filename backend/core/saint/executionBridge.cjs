const aegis = require("../execution/risk/aegisGuard.cjs");
const ExecutionEngine = require("../execution/engine/executionEngine.cjs");
const coinbase = require("../execution/adapters/coinbaseAdapter.cjs");

const engine = new ExecutionEngine(coinbase);

class ExecutionBridge {
  attach(router) {
    router.onExecution = async (signal, context) => {
      const check = aegis.evaluate(signal.data, context);

      if (!check.approved) {
        console.log("[AEGIS BLOCKED]", check.reason);
        return;
      }

      await engine.execute(signal);
    };
  }
}

module.exports = new ExecutionBridge();
