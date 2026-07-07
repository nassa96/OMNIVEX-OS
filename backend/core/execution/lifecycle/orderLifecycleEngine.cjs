/**
 * SAINT V11 — ORDER LIFECYCLE ENGINE
 * ----------------------------------
 * Tracks full order state across execution lifecycle
 */

class OrderLifecycleEngine {

  constructor() {

    this.orders = new Map();
  }

  // ---------------------------
  // CREATE ORDER
  // ---------------------------
  create(order) {

    const id = order.id || this.generateId();

    const entry = {
      id,
      symbol: order.symbol,
      side: order.side,
      qty: order.qty,
      price: order.price,

      state: "CREATED",
      filledQty: 0,
      avgFillPrice: 0,

      timestamps: {
        created: Date.now()
      }
    };

    this.orders.set(id, entry);

    return entry;
  }

  // ---------------------------
  // SUBMIT ORDER
  // ---------------------------
  submit(id) {

    const o = this.orders.get(id);
    if (!o) return null;

    o.state = "SUBMITTED";
    o.timestamps.submitted = Date.now();

    return o;
  }

  // ---------------------------
  // ACKNOWLEDGED BY EXCHANGE
  // ---------------------------
  acknowledge(id) {

    const o = this.orders.get(id);
    if (!o) return null;

    o.state = "ACKNOWLEDGED";
    o.timestamps.ack = Date.now();

    return o;
  }

  // ---------------------------
  // PARTIAL FILL UPDATE
  // ---------------------------
  partialFill(id, fillQty, fillPrice) {

    const o = this.orders.get(id);
    if (!o) return null;

    const totalQty = o.qty;

    const newFilled = o.filledQty + fillQty;

    o.avgFillPrice =
      ((o.avgFillPrice * o.filledQty) + (fillPrice * fillQty))
      / newFilled;

    o.filledQty = newFilled;

    o.state =
      newFilled >= totalQty ? "FILLED" : "PARTIALLY_FILLED";

    o.timestamps.lastFill = Date.now();

    return o;
  }

  // ---------------------------
  // CANCEL ORDER
  // ---------------------------
  cancel(id) {

    const o = this.orders.get(id);
    if (!o) return null;

    o.state = "CANCELED";
    o.timestamps.canceled = Date.now();

    return o;
  }

  // ---------------------------
  // REJECT ORDER
  // ---------------------------
  reject(id, reason) {

    const o = this.orders.get(id);
    if (!o) return null;

    o.state = "REJECTED";
    o.rejectReason = reason;
    o.timestamps.rejected = Date.now();

    return o;
  }

  // ---------------------------
  // PERFORMANCE ANALYSIS
  // ---------------------------
  analyzeOrder(id, marketPrice) {

    const o = this.orders.get(id);
    if (!o) return null;

    const slippage =
      (o.avgFillPrice - o.price) / o.price;

    const timeInMarket =
      (o.timestamps.lastFill || Date.now()) -
      o.timestamps.submitted;

    const adverseMove =
      (marketPrice - o.avgFillPrice) / o.avgFillPrice;

    return {
      id,
      state: o.state,
      filledRatio: o.filledQty / o.qty,
      slippage,
      timeInMarket,
      adverseMove
    };
  }

  // ---------------------------
  // ID GENERATOR
  // ---------------------------
  generateId() {
    return "ord_" + Math.random().toString(36).substring(2, 10);
  }

}

module.exports = OrderLifecycleEngine;
