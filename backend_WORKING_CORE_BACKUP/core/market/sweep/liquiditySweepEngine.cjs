/**
 * SAINT V23 — MICROSTRUCTURE LIQUIDITY SWEEP ENGINE
 * -------------------------------------------------
 * Detects engineered liquidity grabs and stop hunts
 */

class LiquiditySweepEngine {

  constructor() {

    this.history = [];
    this.max = 100;
  }

  // ---------------------------
  // INGEST CANDLE
  // ---------------------------
  ingest(candle) {

    this.history.push({
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume || 1,
      ts: Date.now()
    });

    if (this.history.length > this.max) {
      this.history.shift();
    }
  }

  // ---------------------------
  // DETECT SWEEP ABOVE HIGHS
  // ---------------------------
  sweepHigh() {

    if (this.history.length < 10) return 0;

    const recent = this.history.slice(-10);

    const priorHigh =
      Math.max(...recent.slice(0, 8).map(c => c.high));

    const last = recent[recent.length - 1];

    const swept = last.high > priorHigh;
    const rejected = last.close < priorHigh;

    if (swept && rejected) return 1.0;

    return 0;
  }

  // ---------------------------
  // DETECT SWEEP BELOW LOWS
  // ---------------------------
  sweepLow() {

    if (this.history.length < 10) return 0;

    const recent = this.history.slice(-10);

    const priorLow =
      Math.min(...recent.slice(0, 8).map(c => c.low));

    const last = recent[recent.length - 1];

    const swept = last.low < priorLow;
    const reclaimed = last.close > priorLow;

    if (swept && reclaimed) return 1.0;

    return 0;
  }

  // ---------------------------
  // WICK PRESSURE ANALYSIS
  // ---------------------------
  wickPressure(candle) {

    const upperWick = candle.high - Math.max(candle.open || candle.close, candle.close);
    const lowerWick = Math.min(candle.open || candle.close, candle.close) - candle.low;

    const body = Math.abs(candle.close - (candle.open || candle.close));

    if (body === 0) return 0;

    return (upperWick + lowerWick) / body;
  }

  // ---------------------------
  // SWEEP PROBABILITY SCORE
  // ---------------------------
  sweepScore(candle) {

    const highSweep = this.sweepHigh();
    const lowSweep = this.sweepLow();
    const wick = this.wickPressure(candle);

    return Math.min(1, (highSweep * 0.45) + (lowSweep * 0.45) + (wick * 0.1));
  }

  // ---------------------------
  // CLASSIFICATION
  // ---------------------------
  classify(score) {

    if (score > 0.7) return "ENGINEERED_SWEEP";
    if (score > 0.4) return "SUSPICIOUS";
    if (score > 0.2) return "VOLATILE";

    return "CLEAN";
  }

  // ---------------------------
  // FULL ANALYSIS
  // ---------------------------
  analyze(candle) {

    this.ingest(candle);

    const score = this.sweepScore(candle);

    return {
      score,
      classification: this.classify(score),
      sweepHigh: this.sweepHigh(),
      sweepLow: this.sweepLow(),
      wickPressure: this.wickPressure(candle)
    };
  }
}

module.exports = LiquiditySweepEngine;
