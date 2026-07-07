const eventBus = require("../eventBus");

/**
 * TARTARUS ENGINE
 * Strategy evolution + adversarial learning layer
 *
 * PURPOSE:
 * - analyze executed trades
 * - evaluate outcome quality
 * - mutate signal interpretation
 * - feed improved logic back into SOPHIA
 */

class TartarusEngine {
  constructor() {
    this.history = [];
    this.strategyState = {
      bias: 1.0,          // aggression multiplier
      riskTolerance: 1.0, // adaptive risk scaling
      confidenceShift: 0, // signal calibration drift
    };
  }

  init() {
    eventBus.subscribe("saint.execution", (exec) => {
      this.recordExecution(exec);
    });

    eventBus.subscribe("chronicle.replay", (events) => {
      this.analyzeReplay(events);
    });
  }

  /**
   * STEP 1: STORE EXECUTION OUTCOME
   */
  recordExecution(exec) {
    this.history.push(exec);

    // Trigger evaluation cycle
    this.evaluate(exec);
  }

  /**
   * STEP 2: CORE LEARNING FUNCTION
   */
  evaluate(exec) {
    const { action, confidence, pnl = 0 } = exec;

    // Simple adaptive heuristics (first generation learning loop)
    if (action === "BUY" && pnl < 0) {
      this.strategyState.bias *= 0.97;
      this.strategyState.riskTolerance *= 0.98;
      this.strategyState.confidenceShift -= 0.02;
    }

    if (action === "BUY" && pnl > 0) {
      this.strategyState.bias *= 1.02;
      this.strategyState.confidenceShift += 0.01;
    }

    if (action === "SELL" && pnl < 0) {
      this.strategyState.riskTolerance *= 0.97;
      this.strategyState.confidenceShift -= 0.01;
    }

    if (action === "SELL" && pnl > 0) {
      this.strategyState.bias *= 1.01;
    }

    this.normalize();

    // Push updated intelligence back into system
    eventBus.publish("tartarus.update", {
      strategyState: this.strategyState,
      lastExecution: exec
    });
  }

  /**
   * STEP 3: REPLAY-BASED ANALYSIS
   */
  analyzeReplay(events) {
    if (!events || events.length === 0) return;

    let wins = 0;
    let losses = 0;

    for (const e of events) {
      if (e.type === "saint.execution") {
        if (e.event?.pnl > 0) wins++;
        else losses++;
      }
    }

    const winRate = wins / (wins + losses || 1);

    // Global system adaptation
    if (winRate < 0.4) {
      this.strategyState.bias *= 0.95;
      this.strategyState.riskTolerance *= 0.9;
    }

    if (winRate > 0.65) {
      this.strategyState.bias *= 1.05;
    }

    this.normalize();

    eventBus.publish("tartarus.replay.update", {
      winRate,
      strategyState: this.strategyState
    });
  }

  /**
   * STEP 4: KEEP SYSTEM STABLE
   */
  normalize() {
    this.strategyState.bias = Math.max(0.1, Math.min(this.strategyState.bias, 3));
    this.strategyState.riskTolerance = Math.max(0.1, Math.min(this.strategyState.riskTolerance, 3));
    this.strategyState.confidenceShift = Math.max(-1, Math.min(this.strategyState.confidenceShift, 1));
  }

  /**
   * STEP 5: EXPOSE CURRENT STATE
   */
  getState() {
    return this.strategyState;
  }
}

module.exports = new TartarusEngine();
