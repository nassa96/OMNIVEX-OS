/**
 * SAINT V64 — REPLAY ENGINE
 * Deterministic reconstruction of system behavior
 */

class ChronicleReplayV64 {

  constructor(bus) {
    this.bus = bus;
  }

  replay(filterFn) {

    const events = this.bus.query(filterFn);

    return events.map(e => ({
      state: e.state,
      action: e.action,
      result: e.result
    }));
  }
}

module.exports = ChronicleReplayV64;
