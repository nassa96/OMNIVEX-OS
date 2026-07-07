const eventBus = require("../eventBus");

/**
 * AURIN CORE GOVERNOR
 * System-level arbitration + orchestration layer
 *
 * ROLE:
 * - unify all agent outputs
 * - resolve conflicts between SOPHIA / TARTARUS / SAINT
 * - enforce execution policy
 * - prevent system drift
 * - maintain deterministic runtime state
 */

class AurinCore {
  constructor() {
    this.state = {
      mode: "LIVE",
      risk: "LOW",
      lastDecision: null,
      activeStrategy: null,
      systemHealth: "STABLE"
    };

    this.agentSignals = new Map();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    eventBus.subscribe("sophia.strategy", (strategy) => {
      this.handleStrategy(strategy);
    });

    eventBus.subscribe("saint.execution.request", (exec) => {
      this.validateExecution(exec);
    });

    eventBus.subscribe("tartarus.feedback", (feedback) => {
      this.processLearning(feedback);
    });

    eventBus.subscribe("market.tick", (tick) => {
      this.updateMarketState(tick);
    });
  }

  /**
   * STRATEGY ARBITRATION
   */
  handleStrategy(strategy) {
    if (!strategy) return;

    this.state.activeStrategy = strategy;

    eventBus.publish("aurin.strategy.approved", {
      strategy,
      timestamp: Date.now()
    });
  }

  /**
   * EXECUTION GATEKEEPING
   */
  validateExecution(exec) {
    if (this.state.mode !== "LIVE") {
      return eventBus.publish("aurin.execution.blocked", {
        reason: "system_not_in_live_mode",
        exec
      });
    }

    if (this.state.risk === "HIGH" && exec.confidence < 0.7) {
      return eventBus.publish("aurin.execution.blocked", {
        reason: "risk_filter_triggered",
        exec
      });
    }

    eventBus.publish("aurin.execution.approved", exec);
  }

  /**
   * LEARNING INTEGRATION
   */
  processLearning(feedback) {
    if (!feedback) return;

    const { drawdown, winRate } = feedback;

    if (drawdown > 0.2) {
      this.state.risk = "HIGH";
    }

    if (winRate > 0.6) {
      this.state.risk = "LOW";
    }

    this.state.lastDecision = feedback;

    eventBus.publish("aurin.state.update", this.state);
  }

  /**
   * MARKET STATE TRACKING
   */
  updateMarketState(tick) {
    if (!tick) return;

    if (tick.volatility > 0.8) {
      this.state.risk = "HIGH";
    }

    if (tick.volatility < 0.3) {
      this.state.risk = "LOW";
    }

    eventBus.publish("aurin.market.state", {
      risk: this.state.risk,
      mode: this.state.mode
    });
  }

  /**
   * SYSTEM STATUS
   */
  getState() {
    return this.state;
  }
}

module.exports = new AurinCore();
