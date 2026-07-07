const eventBus = require("../eventBus");

/**
 * LEARNING LOOP ENGINE
 * Connects CHRONICLE (memory) → SOPHIA (intelligence evolution)
 * Enables strategy mutation based on historical outcomes
 */

class LearningLoop {
  constructor() {
    this.enabled = true;

    this.memory = [];
    this.strategyWeights = {
      momentum: 1.0,
      meanReversion: 1.0,
      breakout: 1.0,
      liquidity: 1.0
    };
  }

  init() {
    // Pull execution history from CHRONICLE
    eventBus.subscribe("chronicle.event", (event) => {
      this.ingestMemory(event);
    });

    // Receive performance updates from SAINT
    eventBus.subscribe("saint.execution.result", (result) => {
      this.learnFromExecution(result);
    });

    // Periodic optimization cycle
    setInterval(() => {
      this.optimizeStrategies();
    }, 15000);
  }

  /**
   * Store historical memory events
   */
  ingestMemory(event) {
    this.memory.push(event);

    // Prevent uncontrolled growth
    if (this.memory.length > 1000) {
      this.memory.shift();
    }
  }

  /**
   * Learn from execution outcome
   */
  learnFromExecution(result) {
    const { action, pnl, confidence } = result;

    // Positive reinforcement
    if (pnl > 0) {
      this.adjustWeights(action, +0.05);
    }

    // Negative reinforcement
    if (pnl < 0) {
      this.adjustWeights(action, -0.08);
    }

    eventBus.publish("learning.update", {
      strategyWeights: this.strategyWeights,
      lastResult: result,
      ts: Date.now()
    });
  }

  /**
   * Adjust internal strategy weighting system
   */
  adjustWeights(action, delta) {
    const key = this.mapActionToStrategy(action);

    if (this.strategyWeights[key] !== undefined) {
      this.strategyWeights[key] += delta;

      // clamp bounds
      this.strategyWeights[key] = Math.max(
        0.1,
        Math.min(3.0, this.strategyWeights[key])
      );
    }
  }

  /**
   * Map trade outcomes to strategy families
   */
  mapActionToStrategy(action) {
    switch (action) {
      case "BUY":
        return "momentum";
      case "SELL":
        return "meanReversion";
      default:
        return "liquidity";
    }
  }

  /**
   * Periodic self-optimization cycle
   */
  optimizeStrategies() {
    const avgWeight =
      Object.values(this.strategyWeights).reduce((a, b) => a + b, 0) /
      Object.values(this.strategyWeights).length;

    // Normalize system bias drift
    Object.keys(this.strategyWeights).forEach((key) => {
      this.strategyWeights[key] *= 0.98 + avgWeight * 0.02;
    });

    eventBus.publish("learning.optimized", {
      weights: this.strategyWeights,
      memorySize: this.memory.length,
      ts: Date.now()
    });
  }
}

module.exports = new LearningLoop();
