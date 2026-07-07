/**
 * SAINT V31 — PER-EXCHANGE MEMORY SYSTEM
 * --------------------------------------
 * Learns behavioral execution profiles per exchange
 */

class ExchangeMemoryV31 {

  constructor() {

    this.exchanges = {
      binance: this._create(),
      coinbase: this._create(),
      kraken: this._create(),
      uniswap: this._create(),
      hyperliquid: this._create(),
      custom: this._create()
    };
  }

  _create() {

    return {
      trades: 0,
      pnl: 0,
      slippage: 0,
      latency: 0,
      fillQuality: 0,
      successRate: 0,
      regimeMap: {
        TRENDING: { pnl: 0, slippage: 0 },
        RANGE: { pnl: 0, slippage: 0 },
        CHAOTIC: { pnl: 0, slippage: 0 }
      }
    };
  }

  // =====================================================
  // RECORD EXECUTION
  // =====================================================
  record(exchange, execution) {

    if (!this.exchanges[exchange]) {
      this.exchanges[exchange] = this._create();
    }

    const e = this.exchanges[exchange];

    e.trades += 1;
    e.pnl += execution.pnl || 0;
    e.slippage += execution.slippage || 0;
    e.latency += execution.latency || 0;

    if (execution.success) {
      e.successRate = (e.successRate + 1) / 2;
    } else {
      e.successRate *= 0.98;
    }

    const regime = execution.regime || "CHAOTIC";

    if (!e.regimeMap[regime]) {
      e.regimeMap[regime] = { pnl: 0, slippage: 0 };
    }

    e.regimeMap[regime].pnl += execution.pnl || 0;
    e.regimeMap[regime].slippage += execution.slippage || 0;
  }

  // =====================================================
  // EXCHANGE SCORE MODEL
  // =====================================================
  score(exchange, context = {}) {

    const e = this.exchanges[exchange];
    if (!e) return 0;

    const avgPnL = e.pnl / (e.trades || 1);
    const avgSlippage = e.slippage / (e.trades || 1);
    const avgLatency = e.latency / (e.trades || 1);

    const regime = context.regime || "CHAOTIC";
    const regimePnL = e.regimeMap[regime]?.pnl || 0;

    return (
      avgPnL * 1.5 +
      e.successRate * 2 +
      regimePnL * 0.5 -
      avgSlippage * 2 -
      avgLatency * 0.5
    );
  }

  // =====================================================
  // BEST EXCHANGE SELECTION
  // =====================================================
  bestExchange(context) {

    let best = null;
    let bestScore = -Infinity;

    for (const ex in this.exchanges) {

      const s = this.score(ex, context);

      if (s > bestScore) {
        bestScore = s;
        best = ex;
      }
    }

    return {
      best,
      score: bestScore
    };
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return this.exchanges;
  }
}

module.exports = ExchangeMemoryV31;
