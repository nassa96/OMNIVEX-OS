/**
 * SAINT V63 — EXCHANGE ADAPTER
 * Handles geo-block fallback + API routing safety
 */

class ExchangeAdapterV63 {

  constructor({ binanceUS, fallback }) {
    this.binanceUS = binanceUS;
    this.fallback = fallback;
  }

  async execute(order) {

    try {

      return await this.binanceUS.execute(order);

    } catch (err) {

      console.log("[V63] Binance US failed, switching fallback");

      if (this.fallback) {
        return await this.fallback.execute(order);
      }

      throw err;
    }
  }
}

module.exports = ExchangeAdapterV63;
