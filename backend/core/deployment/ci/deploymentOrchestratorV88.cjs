const AWS = require("../../cloud/aws/awsRouterV88.cjs");
const GCP = require("../../cloud/gcp/gcpRouterV88.cjs");
const Railway = require("../../cloud/railway/railwayRouterV88.cjs");

/**
 * SAINT V88 — MULTI-CLOUD ORCHESTRATOR
 */

class DeploymentOrchestratorV88 {

  constructor() {
    this.aws = new AWS();
    this.gcp = new GCP();
    this.railway = new Railway();
  }

  deployAll(service) {

    return {
      aws: this.aws.deploy(service),
      gcp: this.gcp.deploy(service),
      railway: this.railway.deploy(service)
    };
  }
}

module.exports = DeploymentOrchestratorV88;
