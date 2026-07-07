const eventBus = require("../eventBus");

/**
 * TARTARUS CORE
 * Adversarial simulation + strategy stress testing engine
 */

class TartarusCore {
  constructor() {
    this.mode = "SIMULATION";
    this.scenarios = [];
    this.results = [];
  }

  init() {
    // Receive strategies for testing
    eventBus.subscribe("tartarus.run", (event) => {
      this.runScenario(event.strategy);
    });

    // Receive market replay data
    eventBus.subscribe("market.replay", (event) => {
      this.replayMarket(event.data);
    });
  }

  /**
   * Run adversarial scenario against a strategy
   */
  runScenario(strategy) {
    const scenario = this.generateScenario(strategy);

    const result = {
      strategy: strategy.name || "unknown",
      volatility: scenario.volatility,
      drawdown: this.simulateDrawdown(strategy, scenario),
      pnl: this.simulatePnL(strategy, scenario),
      survival: null,
      ts: Date.now()
    };

    result.survival = result.drawdown < 0.25;

    this.results.push(result);

    eventBus.publish("tartarus.result", result);

    return result;
  }

  /**
   * Generate adversarial market conditions
   */
  generateScenario(strategy) {
    return {
      volatility: Math.random() * 2,
      liquidityShock: Math.random() > 0.7,
      trendFlip: Math.random() > 0.5,
      flashCrash: Math.random() > 0.9
    };
  }

  /**
   * Simulated drawdown calculation
   */
  simulateDrawdown(strategy, scenario) {
    let base = Math.random() * 0.2;

    if (scenario.flashCrash) base += 0.3;
    if (scenario.liquidityShock) base += 0.15;
    if (scenario.volatility > 1.5) base += 0.1;

    return Math.min(base, 1);
  }

  /**
   * Simulated profit/loss under conditions
   */
  simulatePnL(strategy, scenario) {
    let pnl = (Math.random() - 0.4) * 100;

    if (scenario.trendFlip) pnl *= 0.5;
    if (scenario.volatility > 1.5) pnl *= 1.2;

    return pnl;
  }

  /**
   * Market replay mode (historical simulation)
   */
  replayMarket(data) {
    eventBus.publish("tartarus.replay.active", {
      length: data?.length || 0,
      ts: Date.now()
    });
  }
}

module.exports = new TartarusCore();
