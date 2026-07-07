/**
 * SAINT EXECUTION KERNEL
 * Institutional-grade execution state machine
 *
 * Now governed by:
 * - AURIN (approval gate)
 * - internal risk logic
 * - position memory
 */

class SaintKernel {
  constructor(eventBus) {
    this.eventBus = eventBus;

    this.positions = new Map(); // symbol → position
    this.cooldowns = new Map(); // symbol → timestamp

    this.state = {
      totalPnL: 0,
      openExposure: 0,
      trades: 0
    };

    this.cooldownMs = 5000;
    this.maxExposure = 1.0; // normalized risk cap
  }

  /**
   * ENTRY POINT: execution request
   */
  execute(signal) {
    if (!signal) return false;

    const { symbol, action, confidence } = signal;

    // STEP 1: cooldown check
    if (this.isCoolingDown(symbol)) {
      this.eventBus.emit({
        type: "saint.block",
        reason: "COOLDOWN_ACTIVE",
        symbol
      });
      return false;
    }

    // STEP 2: confidence filter
    if (confidence < 0.25) {
      this.eventBus.emit({
        type: "saint.block",
        reason: "LOW_CONFIDENCE",
        symbol
      });
      return false;
    }

    // STEP 3: exposure check
    if (this.state.openExposure > this.maxExposure) {
      this.eventBus.emit({
        type: "saint.block",
        reason: "EXPOSURE_LIMIT",
        symbol
      });
      return false;
    }

    // STEP 4: simulate execution
    const execution = this.simulateExecution(signal);

    // STEP 5: update state
    this.updateState(execution);

    // STEP 6: log to event bus (chronicle)
    this.eventBus.emit({
      type: "saint.execution",
      data: execution
    });

    return execution;
  }

  /**
   * POSITION + MARKET SIMULATION
   */
  simulateExecution(signal) {
    const slippage = Math.random() * 0.002;

    return {
      symbol: signal.symbol,
      action: signal.action,
      confidence: signal.confidence,
      price: signal.price || 0,
      slippage,
      executedPrice: (signal.price || 0) * (1 + slippage),
      ts: Date.now()
    };
  }

  /**
   * STATE UPDATE ENGINE
   */
  updateState(execution) {
    this.state.trades += 1;

    const existing = this.positions.get(execution.symbol);

    if (!existing) {
      this.positions.set(execution.symbol, execution);
    } else {
      // simple overwrite model (upgrade later to position sizing engine)
      this.positions.set(execution.symbol, execution);
    }

    this.cooldowns.set(execution.symbol, Date.now());
  }

  /**
   * COOLDOWN SYSTEM
   */
  isCoolingDown(symbol) {
    const last = this.cooldowns.get(symbol);
    if (!last) return false;

    return Date.now() - last < this.cooldownMs;
  }

  /**
   * SYSTEM SNAPSHOT
   */
  snapshot() {
    return {
      positions: Array.from(this.positions.values()),
      trades: this.state.trades,
      exposure: this.state.openExposure
    };
  }
}

module.exports = SaintKernel;
