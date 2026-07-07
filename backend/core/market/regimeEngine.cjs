class RegimeEngine {
  constructor() {
    this.history = [];
  }

  analyze(market, orderbook = {}) {
    const price = market.price;

    // ---------------------------
    // 1. VOLATILITY (short window proxy)
    // ---------------------------
    const volatility = Math.abs((price % 200) - 100) / 100;

    // ---------------------------
    // 2. LIQUIDITY (fake but structured)
    // bids/asks depth proxy
    // ---------------------------
    const bidDepth = (orderbook.bids?.length || 1);
    const askDepth = (orderbook.asks?.length || 1);
    const liquidity = (bidDepth + askDepth) / 20;

    // ---------------------------
    // 3. TREND DETECTION (momentum proxy)
    // ---------------------------
    this.history.push(price);
    if (this.history.length > 20) this.history.shift();

    const trend = this._calcTrend(this.history);

    // ---------------------------
    // REGIME CLASSIFICATION
    // ---------------------------
    let regime = "RANGING";

    if (volatility > 0.75) regime = "HIGH_VOLATILITY";
    else if (liquidity < 0.2) regime = "LOW_LIQUIDITY";
    else if (trend > 0.6) regime = "TRENDING_UP";
    else if (trend < -0.6) regime = "TRENDING_DOWN";
    else if (Math.abs(trend) < 0.2) regime = "RANGING";

    return {
      regime,
      volatility,
      liquidity,
      trend
    };
  }

  _calcTrend(series) {
    if (series.length < 5) return 0;

    const start = series[0];
    const end = series[series.length - 1];

    return (end - start) / start;
  }
}

module.exports = RegimeEngine;
