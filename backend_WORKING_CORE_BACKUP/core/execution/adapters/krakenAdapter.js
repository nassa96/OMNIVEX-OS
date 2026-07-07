import { ExchangeAdapter } from "../exchangeAdapter.js";

export class KrakenAdapter extends ExchangeAdapter {
  constructor() {
    super("KRAKEN");
  }

  async connect() {
    console.log("[KRAKEN] Connected (simulated)");
  }

  async placeOrder(order) {
    return {
      exchange: "KRAKEN",
      orderId: `kr_${Date.now()}`,
      status: "NEW"
    };
  }

  async getOrderStatus(orderId) {
    return {
      orderId,
      status: "FILLED",
      filledPrice: 50000 + Math.random() * 400
    };
  }

  async cancelOrder(orderId) {
    return {
      orderId,
      status: "CANCELED"
    };
  }
}
