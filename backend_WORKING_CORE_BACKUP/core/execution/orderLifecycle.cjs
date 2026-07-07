class OrderLifecycle {
  constructor() {
    this.orders = new Map(); // orderId -> state object
  }

  createOrder(order) {
    const id = order.id || this._genId();

    const entry = {
      id,
      symbol: order.symbol,
      side: order.side,
      qty: order.qty,
      price: order.price,
      status: "NEW",
      filled: 0,
      avgFillPrice: 0,
      fills: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.orders.set(id, entry);
    return entry;
  }

  updateFromExchange(event) {
    const id = event.orderId || event.clientOrderId;
    if (!this.orders.has(id)) return;

    const order = this.orders.get(id);

    switch (event.status) {

      case "PARTIALLY_FILLED":
        order.status = "PARTIALLY_FILLED";
        order.filled += Number(event.fillQty || 0);
        order.avgFillPrice = this._calcAvg(order, event);
        order.fills.push(event);
        break;

      case "FILLED":
        order.status = "FILLED";
        order.filled = order.qty;
        order.avgFillPrice = event.fillPrice || order.avgFillPrice;
        order.fills.push(event);
        break;

      case "CANCELED":
        order.status = "CANCELED";
        break;

      case "REJECTED":
        order.status = "REJECTED";
        break;

      case "NEW":
        order.status = "OPEN";
        break;
    }

    order.updatedAt = Date.now();
    this.orders.set(id, order);

    return order;
  }

  replaceOrder(oldId, newOrder) {
    const old = this.orders.get(oldId);
    if (!old) return null;

    old.status = "REPLACED";
    this.orders.set(oldId, old);

    return this.createOrder(newOrder);
  }

  get(orderId) {
    return this.orders.get(orderId);
  }

  _calcAvg(order, event) {
    const total = order.avgFillPrice * order.filled;
    const newTotal = total + (event.fillPrice * event.fillQty);
    return newTotal / (order.filled + event.fillQty);
  }

  _genId() {
    return "ord_" + Math.random().toString(36).substring(2, 12);
  }
}

module.exports = OrderLifecycle;
