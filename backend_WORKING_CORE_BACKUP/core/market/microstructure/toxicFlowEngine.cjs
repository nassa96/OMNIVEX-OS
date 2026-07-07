/**
 * SAINT V20 — TOXIC FLOW + MICROSTRUCTURE ENGINE
 * ---------------------------------------------
 * Detects manipulation + hidden liquidity behavior
 */

class ToxicFlowEngine {

  constructor() {

    this.orderbookHistory = [];
    this.maxHistory = 50;
  }

  // ---------------------------
  // INGEST ORDER BOOK SNAPSHOT
  // ---------------------------
  ingest(orderbook) {

    this.orderbookHistory.push({
      bids: orderbook.bids || [],
      asks: orderbook.asks || [],
      volume: orderbook.volume || 0,
      ts: Date.now()
    });

    if (this.orderbookHistory.length > this.maxHistory) {
      this.orderbookHistory.shift();
    }
  }

  // ---------------------------
  // LIQUIDITY IMBALANCE
  // ---------------------------
  liquidityImbalance(book) {

    const bidVol =
      (book.bids || []).reduce((a, b) => a + (b[1] || 0), 0);

    const askVol =
      (book.asks || []).reduce((a, b) => a + (b[1] || 0), 0);

    const total = bidVol + askVol;

    if (total === 0) return 0;

    return (bidVol - askVol) / total;
  }

  // ---------------------------
  // SPOOFING SIGNAL (WALL DISAPPEARANCE)
  // ---------------------------
  spoofingScore() {

    if (this.orderbookHistory.length < 5) return 0;

    const prev = this.orderbookHistory[this.orderbookHistory.length - 2];
    const curr = this.orderbookHistory[this.orderbookHistory.length - 1];

    const prevBid = prev.bids.reduce((a,b)=>a+b[1],0);
    const currBid = curr.bids.reduce((a,b)=>a+b[1],0);

    const drop = (prevBid - currBid) / (prevBid || 1);

    return Math.max(0, Math.min(1, drop));
  }

  // ---------------------------
  // LIQUIDITY ABSORPTION
  // ---------------------------
  absorptionScore() {

    if (this.orderbookHistory.length < 5) return 0;

    const recent = this.orderbookHistory.slice(-5);

    let priceStable = true;
    let volumeIncreasing = false;

    const prices = recent.map(r =>
      (r.bids[0]?.[0] + r.asks[0]?.[0]) / 2
    );

    const max = Math.max(...prices);
    const min = Math.min(...prices);

    priceStable = (max - min) / (min || 1) < 0.002;

    const volumes = recent.map(r =>
      (r.volume || 0)
    );

    volumeIncreasing = volumes[volumes.length - 1] >
                       volumes[0];

    return priceStable && volumeIncreasing ? 0.8 : 0.2;
  }

  // ---------------------------
  // TOXIC FLOW SCORE
  // ---------------------------
  toxicScore(book) {

    const imbalance = Math.abs(this.liquidityImbalance(book));
    const spoof = this.spoofingScore();
    const absorb = this.absorptionScore();

    return Math.min(
      1,
      (imbalance * 0.3) +
      (spoof * 0.4) +
      (absorb * 0.3)
    );
  }

  // ---------------------------
  // FLOW CLASSIFICATION
  // ---------------------------
  classify(score) {

    if (score > 0.7) return "TOXIC";
    if (score > 0.4) return "UNSTABLE";
    if (score > 0.2) return "NEUTRAL";

    return "CLEAN";
  }

  // ---------------------------
  // FULL ANALYSIS
  // ---------------------------
  analyze(orderbook) {

    this.ingest(orderbook);

    const score = this.toxicScore(orderbook);

    return {
      score,
      classification: this.classify(score),
      imbalance: this.liquidityImbalance(orderbook),
      spoofing: this.spoofingScore(),
      absorption: this.absorptionScore()
    };
  }
}

module.exports = ToxicFlowEngine;
