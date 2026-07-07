/**
 * SAINT V103 — TESTNET GATEWAY
 */

class TestnetGatewayV103 {

  constructor({ enabled = true }) {
    this.enabled = enabled;
  }

  route(order) {

    if (!this.enabled) {
      return { error: "TESTNET_DISABLED_BLOCKED" };
    }

    return {
      mode: "TESTNET",
      order,
      status: "SIMULATED_SUBMIT"
    };
  }
}

module.exports = TestnetGatewayV103;
