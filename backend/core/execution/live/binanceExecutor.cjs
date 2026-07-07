/**
 * SAINT V14 — BINANCE LIVE EXECUTOR
 * --------------------------------
 * Places real orders via Binance REST API
 */

const axios = require("axios");

class BinanceExecutor {

  constructor() {

    this.baseUrl = "https://api.binance.com";
    this.apiKey = process.env.BINANCE_API_KEY;
    this.secret = process.env.BINANCE_API_SECRET;
  }

  async placeOrder({ symbol, side, qty, price }) {

    try {

      const order = {
        symbol,
        side: side.toUpperCase(),
        type: "MARKET",
        quantity: qty
      };

      // NOTE: simplified (signature layer required in production)

      const res = await axios.post(
        `${this.baseUrl}/api/v3/order`,
        order,
        {
          headers: {
            "X-MBX-APIKEY": this.apiKey
          }
        }
      );

      return {
        venue: "binance",
        orderId: res.data.orderId,
        status: res.data.status,
        filledQty: res.data.executedQty,
        raw: res.data
      };

    } catch (err) {

      return {
        venue: "binance",
        error: err.response?.data || err.message,
        status: "FAILED"
      };
    }
  }
}

module.exports = BinanceExecutor;
