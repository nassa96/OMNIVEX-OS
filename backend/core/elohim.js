class Elohim {
  constructor(registry = {}) {
    this.registry = registry;
    this.state = {
      mode: "SAFE",
      tick: 0
    };
  }

  coordinate(payload) {
    this.state.tick++;

    return {
      decision: "HOLD",
      reason: "ELohim bootstrap stub active",
      tick: this.state.tick
    };
  }
}

module.exports = { Elohim };
