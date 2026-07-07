class ExchangeIntelligence {
  constructor() {
    this.stats = new Map();
  }

  _get(exchange) {
    if (!this.stats.has(exchange)) {
      this.stats.set(exchange, {
        avgSlippage: 0,
        fillRate: 1,
        latency: 1,
        score: 1,
        count: 0
      });
    }
    return this.stats.get(exchange);
  }

  record(exchange, { slippage, latency, filled }) {
    const s = this._get(exchange);

    const fillScore = filled ? 1 : 0;

    s.avgSlippage =
      (s.avgSlippage * s.count + Math.abs(slippage)) /
      (s.count + 1);

    s.fillRate =
      (s.fillRate * s.count + fillScore) /
      (s.count + 1);

    s.latency =
      (s.latency * s.count + latency) /
      (s.count + 1);

    // composite score (lower slippage + higher fill rate + lower latency)
    s.score =
      (1 - s.avgSlippage) * 0.5 +
      s.fillRate * 0.3 +
      (1 / (1 + s.latency)) * 0.2;

    s.count += 1;

    this.stats.set(exchange, s);
  }

  getBestExchange() {
    let best = null;
    let bestScore = -Infinity;

    for (const [ex, stats] of this.stats.entries()) {
      if (stats.score > bestScore) {
        bestScore = stats.score;
        best = ex;
      }
    }

    return best || "binance";
  }

  getStats() {
    return Object.fromEntries(this.stats);
  }
}

module.exports = ExchangeIntelligence;
