require("dotenv").config();
const axios = require("axios");
const crypto = require("crypto");

/**
 * SAINT V53.1 — SIGNED BINANCE BROKER (LIVE READY)
 * Adds HMAC signing for real API execution
 */

class BinanceSignedBrokerV53_1 {

  constructor() {
    this.baseUrl = "https://api.binance.us";
    this.apiKey = process.env.BINANCE_API_KEY;
    this.apiSecret = process.env.BINANCE_API_SECRET;
  }

  sign(queryString) {
    return crypto
      .createHmac("sha256", this.apiSecret)
      .update(queryString)
      .digest("hex");
  }

  async placeOrder(order) {

    const timestamp = Date.now();

    const params = new URLSearchParams({
      symbol: order.symbol.replace("-", ""),
      side: order.side,
      type: "MARKET",
      quantity: order.size,
      timestamp
    });

    const signature = this.sign(params.toString());
    params.append("signature", signature);

    try {

      // REAL REQUEST STRUCTURE (SAFE READY)
      const response = await axios.post(
        `${this.baseUrl}/api/v3/order?${params.toString()}`,
        {},
        {
          headers: {
            "X-MBX-APIKEY": this.apiKey
          }
        }
      );

      return {
        status: "LIVE_FILLED",
        data: response.data
      };

    } catch (err) {

      return {
        status: "ERROR",
        message: err.response?.data || err.message
      };
    }
  }
}

module.exports = BinanceSignedBrokerV53_1;
