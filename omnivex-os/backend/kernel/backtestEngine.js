/**
 * OMNIVEX OS — BACKTEST ENGINE v1
 * Deterministic simulation runner over historical event streams
 */

export function createBacktestEngine({ chronicle, stateFactory } = {}) {
  if (!chronicle) {
    throw new Error("Chronicle required for backtesting");
  }

  /**
   * =========================
   * SIMULATION STATE
   * =========================
   */

  let simState = null;
  let results = null;

  /**
   * =========================
   * STRATEGY HANDLERS
   * =========================
   */

  const handlers = {
    "market.tick": (state, event) => {
      state.market = event.data;
    },

    "signal.sophia": (state, event) => {
      state.lastSignal = event;
    },

    "execution.order.update": (state, event) => {
      state.lastExecution = event;
    }
  };

  /**
   * =========================
   * RUN BACKTEST
   * =========================
   */

  function run(initialState = {}) {
    const events = chronicle.query?.(0, Date.now()) || [];

    simState = JSON.parse(JSON.stringify(initialState));

    let pnl = 0;

    for (const event of events) {
      const handler = handlers[event.type];

      if (handler) {
        handler(simState, event);
      }

      /**
       * SIMPLE PNL MODEL (placeholder)
       */
      if (event.type === "execution.order.update") {
        const order = event.data;

        if (order.state === "FILLED") {
          pnl += (order.filledSize || 0) * 0.01;
        }
      }
    }

    results = {
      totalEvents: events.length,
      finalState: simState,
      pnl
    };

    return results;
  }

  /**
   * =========================
   * REPORT
   * =========================
   */

  function report() {
    return results || { error: "No backtest run yet" };
  }

  return {
    run,
    report
  };
}
