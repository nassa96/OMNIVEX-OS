const eventBus = require("../eventBus");

/**
 * ELOHIM + MERCURY CORE
 * Unified Market Nervous System
 *
 * Responsibilities:
 * - ingest raw market data
 * - normalize cross-exchange feeds
 * - compute liquidity + volatility
 * - emit unified market state pulses
 */

class ElohimMercuryCore {
  constructor() {
    this.state = {
      price: null,
      volume: null,
      volatility: 0,
      liquidity: 0,
      trend: "NEUTRAL",
      lastUpdate: null
    };

    this.buffer = [];
  }

  init() {
    // Raw market feed input
    eventBus.subscribe("market.raw", (tick) => {
      this.ingest(tick);
    });

    // Periodic consolidation pulse
    setInterval(() => {
      this.computeMarketState();
    }, 2000);
  }

  /**
   * STEP 1: INGEST RAW FEED
   */
  ingest(tick) {
    this.buffer.push(tick);

    if (this.buffer.length > 500) {
      this.buffer.shift();
    }

    eventBus.publish("mercury.tick.raw", tick);
  }

  /**
   * STEP 2: COMPUTE NORMALIZED MARKET STATE
   */
  computeMarketState() {
    if (this.buffer.length === 0) return;

    const latest = this.buffer[this.buffer.length - 1];

    const prices = this.buffer.map(t => t.price || 0);
    const volumes = this.buffer.map(t => t.volume || 0);

    const avgPrice =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const avgVolume =
      volumes.reduce((a, b) => a + b, 0) / volumes.length;

    const volatility = this.calculateVolatility(prices);

    const trend = this.detectTrend(prices);

    this.state = {
      price: latest.price,
      volume: avgVolume,
      volatility,
      liquidity: this.calculateLiquidity(avgVolume, volatility),
      trend,
      lastUpdate: Date.now()
    };

    // Emit unified market pulse
    eventBus.publish("market.tick", this.state);

    // Feed intelligence layer
    eventBus.publish("market.fusion", this.state);
  }

  /**
   * VOLATILITY ENGINE
   */
  calculateVolatility(prices) {
    if (prices.length < 2) return 0;

    const mean =
      prices.reduce((a, b) => a + b, 0) / prices.length;

    const variance =
      prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) /
      prices.length;

    return Math.sqrt(variance);
  }

  /**
   * TREND DETECTOR
   */
  detectTrend(prices) {
    if (prices.length < 10) return "NEUTRAL";

    const recent = prices.slice(-10);
    const first = recent[0];
    const last = recent[recent.length - 1];

    if (last > first * 1.002) return "BULLISH";
    if (last < first * 0.998) return "BEARISH";

    return "NEUTRAL";
  }

  /**
   * LIQUIDITY MODEL
   */
  calculateLiquidity(volume, volatility) {
    if (volatility === 0) return 0;

    return volume / (1 + volatility);
  }
}

module.exports = new ElohimMercuryCore();
