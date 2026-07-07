export class ExchangeInterface {
  async getPrice(symbol) {
    throw new Error("getPrice not implemented");
  }

  async placeOrder(order) {
    throw new Error("placeOrder not implemented");
  }

  async cancelOrder(orderId) {
    throw new Error("cancelOrder not implemented");
  }
}
