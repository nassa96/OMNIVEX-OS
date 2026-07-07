/**
 * SAINT V68 — INFRA SCALE MANAGER
 * Handles scaling + deployment abstraction
 */

class InfraScaleManagerV68 {

  constructor() {
    this.nodes = 1;
    this.mode = "single";
  }

  scale(systemLoad) {

    if (systemLoad > 0.8) {
      this.nodes = 5;
      this.mode = "distributed";
    }

    if (systemLoad < 0.3) {
      this.nodes = 1;
      this.mode = "single";
    }

    return {
      nodes: this.nodes,
      mode: this.mode
    };
  }
}

module.exports = InfraScaleManagerV68;
