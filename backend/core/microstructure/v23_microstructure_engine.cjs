/**
 * SAINT V23 - Microstructure Intelligence Engine
 * Orderbook cognition, sweep detection, spoof pressure, imbalance
 */

class MicrostructureEngine {
  constructor() {
    this.orderbooks = new Map();

    this.state = {
      imbalance: 0,
      spread: 0,
      liquidityPressure: 0,
      sweepDetected: false,
      spoofRisk: 0,
      lastSignal: "NEUTRAL"
    };
  }

  ingest(book) {
    const { symbol, bids = [], asks = [] } = book;

    const bidLevels = this._normalize(bids);
    const askLevels = this._normalize(asks);

    this.orderbooks.set(symbol, {
      bids: bidLevels,
      asks: askLevels,
      ts: Date.now()
    });

    return this.analyze(symbol);
  }

  analyze(symbol) {
    const book = this.orderbooks.get(symbol);
    if (!book) return null;

    const bestBid = book.bids[0]?.price || 0;
    const bestAsk = book.asks[0]?.price || 0;

    const spread = bestAsk - bestBid;

    const bidDepth = this._sumDepth(book.bids);
    const askDepth = this._sumDepth(book.asks);

    const imbalance =
      (bidDepth - askDepth) / (bidDepth + askDepth + 1e-9);

    const liquidityPressure = this._liquidityPressure(book);

    const sweepDetected = this._detectSweep(book, imbalance);

    const spoofRisk = this._spoofDetection(book);

    const signal = this._generateSignal({
      imbalance,
      spread,
      liquidityPressure,
      sweepDetected,
      spoofRisk
    });

    this.state = {
      imbalance,
      spread,
      liquidityPressure,
      sweepDetected,
      spoofRisk,
      lastSignal: signal
    };

    return { symbol, ...this.state };
  }

  _detectSweep(book, imbalance) {
    const bidTop = book.bids[0]?.size || 0;
    const askTop = book.asks[0]?.size || 0;

    return (bidTop < 1 || askTop < 1) && Math.abs(imbalance) > 0.7;
  }

  _spoofDetection(book) {
    const deepBid = book.bids.slice(3, 10).reduce((a, b) => a + b.size, 0);
    const deepAsk = book.asks.slice(3, 10).reduce((a, b) => a + b.size, 0);

    const topBid = book.bids[0]?.size || 0;
    const topAsk = book.asks[0]?.size || 0;

    return (deepBid > topBid * 5 || deepAsk > topAsk * 5) ? 1 : 0;
  }

  _liquidityPressure(book) {
    const nearBid = book.bids.slice(0, 3).reduce((a, b) => a + b.size, 0);
    const nearAsk = book.asks.slice(0, 3).reduce((a, b) => a + b.size, 0);

    return (nearBid - nearAsk) / (nearBid + nearAsk + 1e-9);
  }

  _generateSignal({ imbalance, liquidityPressure, spread, spoofRisk, sweepDetected }) {
    let score = 0;

    score += imbalance * 2;
    score += liquidityPressure * 1.5;
    score -= spread * 0.0001;
    score -= spoofRisk * 1.2;

    if (sweepDetected) score *= 1.5;

    if (score > 0.7) return "BULLISH_MICROSTRUCTURE";
    if (score < -0.7) return "BEARISH_MICROSTRUCTURE";
    return "NEUTRAL";
  }

  _sumDepth(levels) {
    return levels.reduce((sum, l) => sum + l.size, 0);
  }

  _normalize(levels) {
    return levels
      .map(([price, size]) => ({ price: Number(price), size: Number(size) }))
      .sort((a, b) => b.price - a.price);
  }
}

module.exports = MicrostructureEngine;
