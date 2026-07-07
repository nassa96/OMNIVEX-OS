
class MicrostructureEngine {
  constructor() {
    this.history = [];
  }

  compute(orderbook) {
    const bids = orderbook.bids || [];
    const asks = orderbook.asks || [];

    const bestBid = bids.length ? Math.max(...bids.map(b => b.price)) : orderbook.price;
    const bestAsk = asks.length ? Math.min(...asks.map(a => a.price)) : orderbook.price;

    const spread = bestAsk - bestBid;
    const mid = (bestAsk + bestBid) / 2;

    const bidVolume = bids.reduce((sum, b) => sum + (b.size || 0), 0);
    const askVolume = asks.reduce((sum, a) => sum + (a.size || 0), 0);

    const imbalance = (bidVolume - askVolume) / Math.max(bidVolume + askVolume, 1);

    // liquidity quality proxy
    const depth = bidVolume + askVolume;
    const liquidityScore = Math.min(depth / 1000, 1);

    // pressure model
    const pressure =
      imbalance * 0.6 +
      (spread < mid * 0.0005 ? 0.2 : -0.2) +
      liquidityScore * 0.2;

    const signal =
      pressure > 0.25 ? "BUY" :
      pressure < -0.25 ? "SELL" :
      "HOLD";

    const output = {
      mid,
      spread,
      imbalance,
      liquidityScore,
      pressure,
      signal
    };

    this.history.push(output);
    if (this.history.length > 200) this.history.shift();

    return output;
  }
}

module.exports = MicrostructureEngine;

