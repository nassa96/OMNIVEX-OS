/**
 * SAINT V53 — EXECUTION ENGINE
 * Controlled order lifecycle system
 */

class ExecutionEngineV53 {

  constructor({ riskEngine, broker }) {
    this.riskEngine = riskEngine;
    this.broker = broker;

    this.mode = "PAPER"; // PAPER | LIVE

    this.orders = [];
  }

  setMode(mode) {
    this.mode = mode;
  }

  // =====================================================
  // ORDER ENTRY POINT
  // =====================================================
  async execute(signal) {

    // 1. RISK CHECK (AEGIS STYLE GATE)
    const risk = this.riskEngine.evaluate(signal);

    if (risk.block) {
      return {
        status: "BLOCKED",
        reason: risk.reason,
        signal
      };
    }

    // 2. BUILD ORDER
    const order = {
      id: "ORD-" + Date.now(),
      symbol: signal.symbol,
      side: signal.side,
      size: signal.size,
      status: "NEW",
      mode: this.mode
    };

    this.orders.push(order);

    // 3. PAPER MODE (SIMULATION ONLY)
    if (this.mode === "PAPER") {

      order.status = "FILLED_SIM";

      return {
        status: "SIMULATED_FILL",
        order
      };
    }

    // 4. LIVE MODE (REAL BROKER EXECUTION)
    const result = await this.broker.placeOrder(order);

    order.status = result.status;

    return {
      status: "LIVE_EXECUTED",
      order,
      result
    };
  }

  getOrders() {
    return this.orders;
  }
}

module.exports = ExecutionEngineV53;
