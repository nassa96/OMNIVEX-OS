/**
 * SAINT V61 — CLOSED LOOP SIMULATION KERNEL
 */

class SimulationKernelV61 {

  constructor({
    marketEngine,
    executionEngine,
    learningEngine
  }) {
    this.marketEngine = marketEngine;
    this.executionEngine = executionEngine;
    this.learningEngine = learningEngine;

    this.history = [];
  }

  async step(state) {

    const market = this.marketEngine.snapshot();

    const signal = state.signal;
    const strategy = state.strategy;

    const execution = await this.executionEngine.execute(signal);

    const pnl = execution?.data?.pnl || (Math.random() - 0.5);

    this.history.push({
      market,
      signal,
      pnl,
      ts: Date.now()
    });

    this.learningEngine.log(strategy, pnl);

    return {
      market,
      signal,
      pnl
    };
  }

  replay() {
    return this.history;
  }
}

module.exports = SimulationKernelV61;
