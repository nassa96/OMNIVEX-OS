/**
 * SAINT V14 — COINBASE EXECUTOR
 * ----------------------------
 * Simplified Coinbase Advanced Trade execution layer
 */

const axios = require("axios");

class CoinbaseExecutor {

  constructor() {

    this.baseUrl = "https://api.coinbase.com";
    this.apiKey = process.env.COINBASE_API_KEY;
  }

  async placeOrder({ symbol, side, qty }) {

    try {

      const res = await axios.post(
        `${this.baseUrl}/orders`,
        {
          product_id: symbol,
          side,
          size: qty,
          type: "market"
        },
        {
          headers: {
            "Authorization": `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        venue: "coinbase",
        orderId: res.data.id,
        status: res.data.status,
        raw: res.data
      };

    } catch (err) {

      return {
        venue: "coinbase",
        error: err.response?.data || err.message,
        status: "FAILED"
      };
    }
  }
}

module.exports = CoinbaseExecutor;
