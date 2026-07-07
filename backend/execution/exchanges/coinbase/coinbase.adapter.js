import axios from "axios";
import { ExchangeInterface } from "../exchange.interface.js";
import { isLiveMode } from "../../state/mode.js";

export class CoinbaseAdapter extends ExchangeInterface {
  constructor(apiKey) {
    super();
    this.apiKey = apiKey;
  }

  async getPrice(symbol) {
    const res = await axios.get(
      `https://api.coinbase.com/v2/prices/${symbol}-USD/spot`
    );

    const price = parseFloat(res.data.data.amount);

    return {
      symbol,
      price,
      source: "coinbase"
    };
  }

  async placeOrder(order) {
    if (!isLiveMode()) {
      return {
        status: "PAPER_FILL",
        order
      };
    }

    // LIVE EXECUTION PLACEHOLDER (protected boundary)
    return {
      status: "LIVE_ORDER_SENT",
      order,
      note: "Requires authenticated Coinbase trading API integration"
    };
  }

  async cancelOrder(orderId) {
    return {
      status: "CANCEL_NOT_IMPLEMENTED",
      orderId
    };
  }
}
