/**
 * SAINT V104 — ADVANCED RECONCILIATION
 */

class ReconciliationV104 {

  compare(intent, fill) {

    const diff = Math.abs(intent.price - fill.fillPrice);

    return {
      intent,
      fill,
      slippage: diff,
      accuracy: diff < 1
    };
  }
}

module.exports = ReconciliationV104;
