/**
 * SAINT V88 — AWS ROUTER
 */

class AWSRouterV88 {

  deploy(service) {

    return {
      provider: "AWS",
      status: "DEPLOYED",
      service,
      region: "us-east-1",
      ts: Date.now()
    };
  }
}

module.exports = AWSRouterV88;
