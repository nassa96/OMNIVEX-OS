/**
 * OMNIVEX EXCHANGE CLIENT (REAL TRADING LAYER)
 * Unified wrapper using CCXT
 */

const ccxt = require("ccxt");

class ExchangeClient {
  constructor() {
    this.exchange = new ccxt.binance({
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      enableRateLimit: true
    });
  }

  async getBalance() {
    return await this.exchange.fetchBalance();
  }

  async getTicker(symbol) {
    return await this.exchange.fetchTicker(symbol);
  }

  async createOrder(symbol, type, side, amount, price = undefined) {
    return await this.exchange.createOrder(
      symbol,
      type,
      side,
      amount,
      price
    );
  }

  async fetchPositions() {
    if (this.exchange.has["fetchPositions"]) {
      return await this.exchange.fetchPositions();
    }
    return [];
  }
}

module.exports = new ExchangeClient();
