/**
 * SAINT V68 — DEPLOYMENT ORCHESTRATOR
 * Coordinates infra + runtime scaling
 */

class DeploymentOrchestratorV68 {

  constructor(scaleManager, runtimeController) {
    this.scaleManager = scaleManager;
    this.runtimeController = runtimeController;
  }

  orchestrate(systemLoad, mode) {

    const scale = this.scaleManager.scale(systemLoad);
    const runtime = this.runtimeController.route(mode);

    return {
      scale,
      runtime
    };
  }
}

module.exports = DeploymentOrchestratorV68;
