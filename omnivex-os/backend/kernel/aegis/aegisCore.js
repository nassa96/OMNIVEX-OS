const eventBus = require("../eventBus");

/**
 * AEGIS CORE
 * Risk enforcement + execution gating system
 */

class AegisCore {
  constructor() {
    this.state = {
      riskMode: "NORMAL",
      exposure: 0,
      maxExposure: 10000,
      blocked: false
    };
  }

  init() {
    // SOPHIA → AEGIS gate
    eventBus.subscribe("aegis.evaluate", (event) => {
      const decision = this.evaluate(event.signal);
      this.route(decision, event.signal);
    });
  }

  /**
   * Core risk evaluation logic
   */
  evaluate(signal) {
    if (!signal) {
      return { action: "REJECT", reason: "NO_SIGNAL" };
    }

    const confidence = signal.score || signal.confidence || 0;

    // HARD BLOCK conditions
    if (this.state.blocked) {
      return { action: "REJECT", reason: "SYSTEM_LOCKED" };
    }

    if (confidence < 0.15) {
      return { action: "REJECT", reason: "LOW_CONFIDENCE" };
    }

    // RISK ADJUSTMENT LOGIC
    if (confidence < 0.4) {
      return { action: "REDUCE", reason: "MEDIUM_RISK" };
    }

    if (this.state.exposure > this.state.maxExposure) {
      return { action: "REJECT", reason: "EXPOSURE_LIMIT" };
    }

    return { action: "APPROVE", reason: "PASS" };
  }

  /**
   * Route decision to execution layer
   */
  route(decision, signal) {
    if (decision.action === "REJECT") {
      eventBus.publish("aegis.rejected", {
        signal,
        decision
      });
      return;
    }

    if (decision.action === "REDUCE") {
      signal.confidence *= 0.5;
    }

    eventBus.publish("aegis.approved", {
      signal,
      decision
    });
  }

  /**
   * Emergency kill switch
   */
  kill() {
    this.state.blocked = true;

    eventBus.publish("aegis.kill_switch", {
      ts: Date.now()
    });
  }

  /**
   * Reset system
   */
  reset() {
    this.state.blocked = false;
    this.state.exposure = 0;
  }
}

module.exports = new AegisCore();
