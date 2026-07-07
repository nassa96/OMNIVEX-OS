/**
 * SAINT V57 — ORDERFLOW INTELLIGENCE ENGINE
 * Detects real market intent from liquidity + trade pressure
 */

class OrderflowEngineV57 {

  constructor(feed) {
    this.feed = feed;
  }

  // =====================================================
  // LIQUIDITY IMBALANCE
  // =====================================================
  liquidityImbalance(book) {

    if (!book?.bids || !book?.asks) return 0;

    const bidVol = book.bids.slice(0, 5)
      .reduce((s, b) => s + b.size, 0);

    const askVol = book.asks.slice(0, 5)
      .reduce((s, a) => s + a.size, 0);

    return (bidVol - askVol) / (bidVol + askVol + 1e-9);
  }

  // =====================================================
  // TAKER PRESSURE (BUY vs SELL AGGRESSION)
  // =====================================================
  takerPressure(trades) {

    if (!trades || trades.length === 0) return 0;

    let buy = 0;
    let sell = 0;

    for (const t of trades.slice(-50)) {

      if (t.side === "buy") buy += t.size;
      if (t.side === "sell") sell += t.size;
    }

    return (buy - sell) / (buy + sell + 1e-9);
  }

  // =====================================================
  // ABSORPTION DETECTION
  // =====================================================
  absorption(book, trades) {

    const liq = this.liquidityImbalance(book);
    const pressure = this.takerPressure(trades);

    // absorption = strong aggression but weak movement bias
    const divergence = pressure - liq;

    return divergence;
  }

  // =====================================================
  // FULL ORDERFLOW STATE
  // =====================================================
  analyze(market) {

    const book = market.orderbook;
    const trades = market.trades;

    const liq = this.liquidityImbalance(book);
    const pressure = this.takerPressure(trades);
    const absorption = this.absorption(book, trades);

    // =====================================================
    // INTENT CLASSIFICATION
    // =====================================================
    let intent = "NEUTRAL";

    if (pressure > 0.5 && liq > 0.2) intent = "BULLISH_IMPULSE";
    if (pressure < -0.5 && liq < -0.2) intent = "BEARISH_IMPULSE";

    if (absorption > 0.6) intent = "DISTRIBUTION";
    if (absorption < -0.6) intent = "ACCUMULATION";

    return {
      intent,
      liquidityImbalance: liq,
      takerPressure: pressure,
      absorption,
      strength: Math.abs(liq) + Math.abs(pressure)
    };
  }
}

module.exports = OrderflowEngineV57;
