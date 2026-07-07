const ExecutionDesk = require("./executionDesk.cjs");
const LiveExecutionEngine = require("../core/execution/live/liveExecutionEngine.cjs");

/**
 * SAINT V14 — LIVE EXECUTION DESK
 */

class LiveExecutionDesk {

  constructor() {

    this.desk = new ExecutionDesk();
    this.live = new LiveExecutionEngine();
  }

  async execute(signal, venues) {

    const planned =
      this.desk.execute(signal, venues);

    const liveResults = [];

    for (const r of planned.results) {

      const execution = await this.live.execute({
        venue: r.venue,
        symbol: "BTCUSDT",
        side: signal.signal,
        qty: r.qty
      });

      liveResults.push(execution);
    }

    return {
      planned,
      liveResults
    };
  }
}

module.exports = LiveExecutionDesk;
