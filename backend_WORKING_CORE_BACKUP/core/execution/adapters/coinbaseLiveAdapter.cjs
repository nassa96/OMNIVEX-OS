const config = require("../config/executionMode.cjs");

class CoinbaseLiveAdapter {
  async placeOrder(signal) {
    if (!config.allowLiveTrading) {
      console.log("[COINBASE] LIVE DISABLED → SIMULATION MODE");

      return {
        exchange: "coinbase",
        status: "SIMULATED_BLOCKED",
        reason: "LIVE_TRADING_DISABLED",
        signal
      };
    }

    // REAL API PLACEHOLDER (you will plug API keys here)
    console.log("[COINBASE LIVE ORDER]", signal);

    return {
      exchange: "coinbase",
      status: "LIVE_ORDER_SENT",
      signal,
      timestamp: Date.now()
    };
  }
}

module.exports = new CoinbaseLiveAdapter();
