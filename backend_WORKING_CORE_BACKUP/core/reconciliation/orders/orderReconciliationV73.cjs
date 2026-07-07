/**
 * SAINT V73 — ORDER RECONCILIATION ENGINE
 * Ensures execution truth = exchange truth
 */

class OrderReconciliationV73 {

  constructor() {
    this.localOrders = new Map();
    this.exchangeOrders = new Map();
  }

  // =====================================================
  // REGISTER INTENT
  // =====================================================
  register(order) {
    this.localOrders.set(order.id, {
      ...order,
      status: "PENDING"
    });
  }

  // =====================================================
  // UPDATE FROM EXCHANGE
  // =====================================================
  updateFromExchange(order) {
    this.exchangeOrders.set(order.id, order);
  }

  // =====================================================
  // RECONCILE STATE
  // =====================================================
  reconcile() {

    const mismatches = [];

    for (const [id, local] of this.localOrders.entries()) {

      const remote = this.exchangeOrders.get(id);

      if (!remote) {
        mismatches.push({ id, issue: "MISSING_ON_EXCHANGE" });
        continue;
      }

      if (local.status !== remote.status) {
        mismatches.push({
          id,
          issue: "STATE_MISMATCH",
          local: local.status,
          remote: remote.status
        });
      }
    }

    return {
      mismatches,
      health: mismatches.length === 0
    };
  }
}

module.exports = OrderReconciliationV73;
