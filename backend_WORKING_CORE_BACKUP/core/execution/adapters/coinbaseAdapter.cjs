class CoinbaseAdapter {
  async placeOrder(signal) {
    console.log("[COINBASE ADAPTER] order:", signal);

    // SAFE DEFAULT = SIMULATION MODE
    return {
      exchange: "coinbase",
      status: "SIMULATED_ORDER",
      side: signal.side || "BUY",
      symbol: signal.symbol,
      price: signal.price,
      timestamp: Date.now()
    };
  }
}

module.exports = new CoinbaseAdapter();
