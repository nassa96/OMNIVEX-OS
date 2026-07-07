const ExecutionBrain = require("../core/execution/brain/executionBrain.cjs");

class CanonicalLoop {

  constructor({ sophia, feed, risk, exec }) {
    this.sophia = sophia;
    this.feed = feed;
    this.risk = risk;
    this.exec = exec;

    this.brain = new ExecutionBrain();

    this.state = {};
  }

  start() {
    console.log("[SAINT] Unified Execution Brain Online");

    this.feed.connect((market) => {

      const signal = this.sophia.analyze(market);

      const brain = this.brain.evaluate({
        market,
        orderbook: market,
        signal: signal?.signal
      });

      const decision = brain.allowExecution ? "ALLOW" : "BLOCK";

      const execution = this.exec.execute(decision, market);

      this.state = {
        signal,
        brain,
        execution
      };

      console.log("[SAINT BRAIN LOOP]", this.state);
    });
  }
}

module.exports = CanonicalLoop;
