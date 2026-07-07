const bus = require("./bus/eventBus.cjs");

class SAINTKernel {
  constructor(plugins = {}) {
    this.plugins = plugins;
    this.state = {};
  }

  boot() {
    console.log("[SAINT KERNEL] Booting event-driven system...");

    this._registerHandlers();
  }

  _registerHandlers() {

    bus.onEvent("MARKET_TICK", (tick) => {
      bus.emitEvent("NORMALIZE", tick);
    });

    bus.onEvent("NORMALIZE", (tick) => {
      const normalized = {
        ...tick,
        ts: Date.now()
      };

      bus.emitEvent("MICROSTRUCTURE", normalized);
    });

    bus.onEvent("MICROSTRUCTURE", (market) => {
      const micro = this.plugins.microstructure?.evaluate(market);
      bus.emitEvent("SIGNAL", { market, micro });
    });

    bus.onEvent("SIGNAL", ({ market, micro }) => {
      const signal = this.plugins.sophia?.analyze(market, micro);

      bus.emitEvent("EXECUTION_INTENT", {
        market,
        micro,
        signal
      });
    });

    bus.onEvent("EXECUTION_INTENT", (payload) => {
      const decision = this.plugins.brain?.evaluate(payload);

      bus.emitEvent("RISK_CHECK", {
        ...payload,
        decision
      });
    });

    bus.onEvent("RISK_CHECK", (payload) => {
      const allowed = this.plugins.risk?.evaluate(payload);

      bus.emitEvent("EXECUTE", {
        ...payload,
        allowed
      });
    });

    bus.onEvent("EXECUTE", (payload) => {
      const execution = this.plugins.execution?.execute(payload);

      bus.emitEvent("CHRONICLE", {
        ...payload,
        execution
      });
    });

    bus.onEvent("CHRONICLE", (event) => {
      this.plugins.chronicle?.record(event);

      console.log("[SAINT EVENT]", {
        symbol: event.market.symbol,
        signal: event.signal,
        decision: event.decision?.score,
        execution: event.execution?.status
      });
    });
  }
}

module.exports = SAINTKernel;
