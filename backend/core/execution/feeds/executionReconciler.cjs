/**
 * SAINT V15 — EXECUTION RECONCILER
 * --------------------------------
 * Syncs live exchange updates with internal lifecycle engine
 */

class ExecutionReconciler {

  constructor(lifecycleEngine) {
    this.lifecycle = lifecycleEngine;
  }

  apply(update) {

    const id = update.orderId;

    if (!id) return;

    switch (update.status) {

      case "NEW":
        this.lifecycle.submit(id);
        break;

      case "PARTIALLY_FILLED":
        this.lifecycle.partialFill(
          id,
          update.filledQty || 0,
          update.avgPrice || update.price || 0
        );
        break;

      case "FILLED":
        this.lifecycle.partialFill(
          id,
          update.filledQty || 1,
          update.avgPrice || update.price || 0
        );
        break;

      case "CANCELED":
      case "CANCELLED":
        this.lifecycle.cancel(id);
        break;

      case "REJECTED":
        this.lifecycle.reject(id, update.reason);
        break;
    }

    return this.lifecycle.orders.get(id);
  }
}

module.exports = ExecutionReconciler;
