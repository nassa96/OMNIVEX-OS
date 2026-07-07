const eventBus = require("../eventBus");

/**
 * CHRONICLE CORE
 * Memory + replay + learning substrate
 */

class ChronicleCore {
  constructor() {
    this.events = [];
    this.stateSnapshots = [];
  }

  init() {
    // Listen to all executed events
    eventBus.subscribe("*", (event) => {
      this.record(event);
    });

    // Optional: SAINT feedback loop hook
    eventBus.subscribe("saint.execution", (event) => {
      this.snapshotState(event);
    });
  }

  /**
   * Record raw event into memory
   */
  record(event) {
    if (!event) return;

    const entry = {
      ...event,
      ts: event.ts || Date.now()
    };

    this.events.push(entry);

    // bounded memory
    if (this.events.length > 5000) {
      this.events.shift();
    }
  }

  /**
   * Snapshot system state after execution
   */
  snapshotState(execution) {
    const snapshot = {
      execution,
      memoryDepth: this.events.length,
      timestamp: Date.now()
    };

    this.stateSnapshots.push(snapshot);

    if (this.stateSnapshots.length > 1000) {
      this.stateSnapshots.shift();
    }
  }

  /**
   * Replay last N events
   */
  replay(limit = 50) {
    return this.events.slice(-limit);
  }

  /**
   * Get learning dataset window
   */
  dataset(window = 200) {
    return {
      events: this.events.slice(-window),
      snapshots: this.stateSnapshots.slice(-50)
    };
  }

  /**
   * Clear memory (emergency reset)
   */
  reset() {
    this.events = [];
    this.stateSnapshots = [];
  }
}

module.exports = new ChronicleCore();
