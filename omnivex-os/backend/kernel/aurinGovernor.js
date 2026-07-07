/**
 * AURIN GOVERNOR CORE
 * (Prometheus-class orchestration layer replacement)
 *
 * Responsibilities:
 * - arbitrate all system events
 * - enforce execution priority
 * - resolve conflicting agent outputs
 * - gate SAINT execution
 * - maintain system coherence
 */

class AurinGovernor {
  constructor(eventBus) {
    this.eventBus = eventBus;

    this.state = {
      mode: "ACTIVE",
      riskMode: "LOW",
      lastDecision: null
    };

    this.priorityMap = {
      "aegis.risk": 100,
      "sophia.signal": 80,
      "market.tick": 50,
      "saint.execution": 70,
      "chronicle.record": 10
    };
  }

  /**
   * Main arbitration engine
   */
  evaluate(event) {
    const priority = this.priorityMap[event.type] || 0;

    // BLOCK high-risk execution paths
    if (event.type === "saint.execution") {
      if (this.state.riskMode === "LOCKED") {
        return {
          approved: false,
          reason: "RISK_LOCK_ACTIVE"
        };
      }
    }

    // SOPHIA signal filtering (noise reduction layer)
    if (event.type === "sophia.signal") {
      if (!event.data || event.data.score < 0.2) {
        return {
          approved: false,
          reason: "LOW_SIGNAL_CONFIDENCE"
        };
      }
    }

    // Default approval logic
    return {
      approved: true,
      priority
    };
  }

  /**
   * Inject governance decision into system
   */
  process(event) {
    const decision = this.evaluate(event);

    this.state.lastDecision = {
      event,
      decision,
      ts: Date.now()
    };

    if (!decision.approved) {
      this.eventBus.emit({
        type: "aurin.block",
        reason: decision.reason,
        original: event
      });

      return false;
    }

    this.eventBus.emit({
      type: "aurin.approve",
      original: event
    });

    return true;
  }

  setRiskMode(mode) {
    this.state.riskMode = mode;
  }
}

module.exports = AurinGovernor;
