/**
 * SAINT V100 — ORDER CONFIRMATION TRACKER
 */

class OrderConfirmationV100 {

  constructor() {
    this.pending = [];
    this.confirmed = [];
  }

  track(order) {
    this.pending.push(order);
  }

  confirm(orderId) {

    this.confirmed.push({
      orderId,
      ts: Date.now()
    });
  }

  status() {
    return {
      pending: this.pending.length,
      confirmed: this.confirmed.length
    };
  }
}

module.exports = OrderConfirmationV100;
