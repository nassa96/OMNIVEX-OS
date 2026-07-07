/**
 * SAINT v10 Exchange Adapter Interface
 * Standard contract for all exchanges
 */

class ExchangeAdapter {
  constructor(name) {
    this.name = name;
  }

  async connect() {
    throw new Error("connect() not implemented");
  }

  async placeOrder(order) {
    throw new Error("placeOrder() not implemented");
  }

  async cancelOrder(orderId) {
    throw new Error("cancelOrder() not implemented");
  }

  async getOrderStatus(orderId) {
    throw new Error("getOrderStatus() not implemented");
  }
}

export { ExchangeAdapter };
