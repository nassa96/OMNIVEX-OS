/**
 * SAINT V70 — REAL EXCHANGE ADAPTER
 * Unified interface for real trading venues
 */

class RealExchangeAdapterV70 {

  constructor({ binanceUS, coinbase, fallback }) {
    this.binanceUS = binanceUS;
    this.coinbase = coinbase;
    this.fallback = fallback;
  }

  // =====================================================
  // NORMALIZED ORDER EXECUTION
  // =====================================================
  async execute(order) {

    try {

      if (order.venue === "binanceUS") {
        return await this.binanceUS.execute(order);
      }

      if (order.venue === "coinbase") {
        return await this.coinbase.execute(order);
      }

      return await this.fallback.execute(order);

    } catch (err) {

      console.log("[V70] Primary exchange failed → fallback activated");

      return await this.fallback.execute(order);
    }
  }
}

module.exports = RealExchangeAdapterV70;
