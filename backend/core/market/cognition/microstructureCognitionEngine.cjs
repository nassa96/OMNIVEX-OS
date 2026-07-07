/**
 * SAINT V23 + V24 — MICROSTRUCTURE COGNITION BRAIN
 * ------------------------------------------------
 * Unified perception layer:
 * Flow + Sweep + Liquidity + Intent fusion
 */

class MicrostructureCognitionEngine {

  constructor() {

    this.flowHistory = [];
    this.candleHistory = [];

    this.maxFlow = 200;
    this.maxCandles = 100;
  }

  // =====================================================
  // FLOW INGEST (from V21)
  // =====================================================
  ingestTrade(trade) {

    this.flowHistory.push({
      price: trade.price,
      size: trade.size || 1,
      side: trade.side,
      ts: Date.now()
    });

    if (this.flowHistory.length > this.maxFlow) {
      this.flowHistory.shift();
    }
  }

  // =====================================================
  // CANDLE INGEST (from V23)
  // =====================================================
  ingestCandle(candle) {

    this.candleHistory.push({
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume || 1,
      ts: Date.now()
    });

    if (this.candleHistory.length > this.maxCandles) {
      this.candleHistory.shift();
    }
  }

  // =====================================================
  // FLOW PRESSURE (BUY VS SELL DOMINANCE)
  // =====================================================
  flowPressure(window = 50) {

    const slice = this.flowHistory.slice(-window);

    let buy = 0;
    let sell = 0;

    for (const t of slice) {
      if (t.side === "buy") buy += t.size;
      if (t.side === "sell") sell += t.size;
    }

    const total = buy + sell;
    if (total === 0) return 0;

    return (buy - sell) / total;
  }

  // =====================================================
  // FLOW MOMENTUM (INSTITUTIONAL AGGRESSION)
  // =====================================================
  flowMomentum() {

    const slice = this.flowHistory.slice(-20);

    let score = 0;

    for (let i = 1; i < slice.length; i++) {

      const prev = slice[i - 1];
      const curr = slice[i];

      if (curr.side === prev.side) {
        score += curr.size;
      } else {
        score -= curr.size;
      }
    }

    return score / (slice.length || 1);
  }

  // =====================================================
  // SWEEP DETECTION (HIGH + LOW)
  // =====================================================
  detectSweep() {

    if (this.candleHistory.length < 10) {
      return { high: 0, low: 0 };
    }

    const recent = this.candleHistory.slice(-10);

    const priorHigh =
      Math.max(...recent.slice(0, 8).map(c => c.high));

    const priorLow =
      Math.min(...recent.slice(0, 8).map(c => c.low));

    const last = recent[recent.length - 1];

    const sweepHigh = (last.high > priorHigh && last.close < priorHigh) ? 1 : 0;
    const sweepLow = (last.low < priorLow && last.close > priorLow) ? 1 : 0;

    return {
      high: sweepHigh,
      low: sweepLow
    };
  }

  // =====================================================
  // LIQUIDITY STRESS (IMBALANCE SIGNAL)
  // =====================================================
  liquidityStress(orderbook) {

    if (!orderbook) return 0;

    const bidVol = (orderbook.bids || []).reduce((a,b)=>a+(b[1]||0),0);
    const askVol = (orderbook.asks || []).reduce((a,b)=>a+(b[1]||0),0);

    const total = bidVol + askVol;
    if (total === 0) return 0;

    return Math.abs(bidVol - askVol) / total;
  }

  // =====================================================
  // CORE INTENT CLASSIFICATION
  // =====================================================
  classify(context) {

    const flow = this.flowPressure();
    const momentum = this.flowMomentum();
    const sweep = this.detectSweep();

    const sweepScore = sweep.high + sweep.low;
    const liquidity = this.liquidityStress(context?.orderbook);

    // -------------------------
    // ENGINEERED MOVE DETECTION
    // -------------------------
    const engineered =
      sweepScore > 0 &&
      flow < 0.2 &&
      momentum < 0.1;

    // -------------------------
    // ACCUMULATION
    // -------------------------
    const accumulation =
      flow > 0.25 &&
      momentum > 0;

    // -------------------------
    // DISTRIBUTION
    // -------------------------
    const distribution =
      flow < -0.25 &&
      momentum < 0;

    let state = "NEUTRAL";

    if (engineered) state = "ENGINEERED_SWEEP";
    else if (accumulation) state = "ACCUMULATION";
    else if (distribution) state = "DISTRIBUTION";

    return {
      state,
      flowPressure: flow,
      flowMomentum: momentum,
      sweep,
      liquidityStress: liquidity,
      engineeredMove: engineered
    };
  }
}

module.exports = MicrostructureCognitionEngine;
