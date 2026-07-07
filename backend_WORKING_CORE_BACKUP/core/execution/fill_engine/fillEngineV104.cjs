/**
 * SAINT V104 — FILL ENGINE
 */

class FillEngineV104 {

  generateFill(order) {

    const fillPrice =
      order.price + (Math.random() - 0.5) * 5;

    return {
      orderId: order.id || "UNKNOWN",
      fillPrice,
      filledQty: order.size,
      ts: Date.now()
    };
  }
}

module.exports = FillEngineV104;
