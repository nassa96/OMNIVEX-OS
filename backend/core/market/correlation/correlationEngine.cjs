/**
 * SAINT V19 — CROSS-ASSET REGIME CORRELATION ENGINE
 * --------------------------------------------------
 * Detects macro structure across multiple assets
 */

class CorrelationEngine {

  constructor() {

    this.history = {
      BTC: [],
      ETH: [],
      TOTAL: []
    };

    this.max = 200;
  }

  // ---------------------------
  // INGEST MULTI-ASSET DATA
  // ---------------------------
  ingest(marketData) {

    for (const [symbol, data] of Object.entries(marketData)) {

      if (!this.history[symbol]) {
        this.history[symbol] = [];
      }

      this.history[symbol].push({
        price: data.price,
        ts: Date.now()
      });

      if (this.history[symbol].length > this.max) {
        this.history[symbol].shift();
      }
    }
  }

  // ---------------------------
  // SIMPLE RETURN SERIES
  // ---------------------------
  returns(series) {

    const r = [];

    for (let i = 1; i < series.length; i++) {
      r.push(
        (series[i].price - series[i - 1].price) /
        series[i - 1].price
      );
    }

    return r;
  }

  // ---------------------------
  // CORRELATION BETWEEN TWO ASSETS
  // ---------------------------
  correlation(a, b) {

    const ra = this.returns(a);
    const rb = this.returns(b);

    const len = Math.min(ra.length, rb.length);

    if (len < 10) return 0;

    let meanA = 0;
    let meanB = 0;

    for (let i = 0; i < len; i++) {
      meanA += ra[i];
      meanB += rb[i];
    }

    meanA /= len;
    meanB /= len;

    let num = 0;
    let da = 0;
    let db = 0;

    for (let i = 0; i < len; i++) {

      const x = ra[i] - meanA;
      const y = rb[i] - meanB;

      num += x * y;
      da += x * x;
      db += y * y;
    }

    return num / (Math.sqrt(da * db) || 1);
  }

  // ---------------------------
  // REGIME ALIGNMENT SCORE
  // ---------------------------
  regimeAlignment(stateA, stateB) {

    let score = 0;

    if (stateA.volatility === stateB.volatility) score += 0.4;
    if (stateA.trend === stateB.trend) score += 0.4;
    if (stateA.liquidity === stateB.liquidity) score += 0.2;

    return score;
  }

  // ---------------------------
  // GLOBAL MARKET COHERENCE
  // ---------------------------
  coherence(regimes) {

    const btc = regimes.BTC;
    const eth = regimes.ETH;

    if (!btc || !eth) return 0;

    const align = this.regimeAlignment(btc, eth);
    const corr = this.correlation(
      this.history.BTC,
      this.history.ETH
    );

    return (align * 0.6) + (corr * 0.4);
  }

  // ---------------------------
  // DIVERGENCE DETECTION
  // ---------------------------
  divergence(regimes) {

    const btc = regimes.BTC;
    const eth = regimes.ETH;

    if (!btc || !eth) return null;

    const btcUp = btc.trend === "UP";
    const ethUp = eth.trend === "UP";

    if (btcUp !== ethUp) {
      return {
        type: "LEAD_LAG_DIVERGENCE",
        btc: btc.trend,
        eth: eth.trend
      };
    }

    return null;
  }

  // ---------------------------
  // FULL ANALYSIS
  // ---------------------------
  analyze(marketData, regimes) {

    this.ingest(marketData);

    return {
      coherence: this.coherence(regimes),
      divergence: this.divergence(regimes),
      btcEthCorrelation: this.correlation(
        this.history.BTC,
        this.history.ETH
      )
    };
  }
}

module.exports = CorrelationEngine;
