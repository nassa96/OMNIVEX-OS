const eventBus = require("../eventBus");
const Tartarus = require("../tartarus/tartarusEngine");

/**
 * SOPHIA EVOLUTION CORE
 * Generates + mutates trading logic (not just signals)
 *
 * ROLE:
 * - interpret market state
 * - generate strategies dynamically
 * - inject adaptive logic into SAINT
 * - evolve decision-making rules
 */

class SophiaEvolutionEngine {
  constructor() {
    this.strategyPool = [];
    this.activeStrategy = null;
    this.marketState = null;
  }

  init() {
    eventBus.subscribe("market.tick", (tick) => {
      this.marketState = tick;
      this.evolve();
    });

    eventBus.subscribe("tartarus.update", (update) => {
      this.applyLearning(update);
    });
  }

  /**
   * STEP 1: CORE EVOLUTION LOOP
   */
  evolve() {
    if (!this.marketState) return;

    const strategy = this.generateStrategy(this.marketState);

    this.strategyPool.push(strategy);

    // keep only best 20 candidates
    if (this.strategyPool.length > 20) {
      this.strategyPool.shift();
    }

    this.activeStrategy = this.selectBestStrategy();

    eventBus.publish("sophia.strategy", this.activeStrategy);
  }

  /**
   * STEP 2: STRATEGY GENERATION (KEY INNOVATION POINT)
   */
  generateStrategy(market) {
    const volatility = market.volatility || Math.random();
    const trend = market.trend || "NEUTRAL";

    let strategy = {
      type: "adaptive",
      bias: 0,
      risk: 1,
      threshold: 0.5
    };

    // dynamic strategy morphing
    if (trend === "BULLISH" && volatility > 0.6) {
      strategy.bias = 1.2;
      strategy.threshold = 0.55;
    }

    if (trend === "BEARISH" && volatility > 0.6) {
      strategy.bias = -1.2;
      strategy.threshold = 0.6;
    }

    if (volatility < 0.3) {
      strategy.bias = 0.3;
      strategy.threshold = 0.4;
    }

    return strategy;
  }

  /**
   * STEP 3: APPLY LEARNING FROM TARTARUS
   */
  applyLearning(update) {
    const { strategyState } = update;

    // adjust generation parameters
    if (strategyState.bias < 0.8) {
      this.increaseConservatism();
    }

    if (strategyState.bias > 1.5) {
      this.increaseAggression();
    }
  }

  increaseConservatism() {
    this.strategyPool.forEach(s => {
      s.threshold += 0.02;
      s.bias *= 0.95;
    });
  }

  increaseAggression() {
    this.strategyPool.forEach(s => {
      s.threshold -= 0.02;
      s.bias *= 1.05;
    });
  }

  /**
   * STEP 4: STRATEGY SELECTION
   */
  selectBestStrategy() {
    if (this.strategyPool.length === 0) return null;

    // lightweight scoring model
    return this.strategyPool.reduce((best, current) => {
      const scoreA = Math.abs(best.bias) / (best.threshold + 0.01);
      const scoreB = Math.abs(current.bias) / (current.threshold + 0.01);
      return scoreB > scoreA ? current : best;
    });
  }

  /**
   * STEP 5: OUTPUT TO EXECUTION ENGINE
   */
  getActiveStrategy() {
    return this.activeStrategy;
  }
}

module.exports = new SophiaEvolutionEngine();
