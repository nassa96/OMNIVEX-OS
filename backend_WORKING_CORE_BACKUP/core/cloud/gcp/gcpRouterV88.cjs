/**
 * SAINT V88 — GCP ROUTER
 */

class GCPRouterV88 {

  deploy(service) {

    return {
      provider: "GCP",
      status: "DEPLOYED",
      service,
      region: "us-central1",
      ts: Date.now()
    };
  }
}

module.exports = GCPRouterV88;
