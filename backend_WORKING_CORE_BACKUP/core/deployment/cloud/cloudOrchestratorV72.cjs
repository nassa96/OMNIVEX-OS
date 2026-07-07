/**
 * SAINT V72 — CLOUD ORCHESTRATOR
 * Prepares system for distributed deployment
 */

class CloudOrchestratorV72 {

  constructor() {
    this.nodes = 1;
    this.region = "local";
  }

  deploy(load) {

    if (load > 0.8) {
      this.nodes = 5;
      this.region = "multi-region";
    }

    return {
      nodes: this.nodes,
      region: this.region
    };
  }
}

module.exports = CloudOrchestratorV72;
