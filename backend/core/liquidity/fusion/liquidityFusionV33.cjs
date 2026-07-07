/**
 * SAINT V33 — CROSS-EXCHANGE LIQUIDITY FUSION ENGINE
 * ---------------------------------------------------
 * Builds a synthetic global orderbook from all venues
 */

class LiquidityFusionV33 {

  constructor() {

    this.books = {};
    this.normalized = {
      bids: {},
      asks: {}
    };
  }

  // =====================================================
  // INGEST ORDERBOOK FROM ANY EXCHANGE
  // =====================================================
  ingest(exchange, orderbook) {

    if (!orderbook) return;

    this.books[exchange] = orderbook;

    this._normalize();
  }

  // =====================================================
  // NORMALIZE ALL ORDERBOOKS INTO GLOBAL MAP
  // =====================================================
  _normalize() {

    const bids = {};
    const asks = {};

    for (const ex in this.books) {

      const book = this.books[ex];

      // ---------------------
      // BIDS
      // ---------------------
      for (const [price, size] of (book.bids || [])) {

        const p = Number(price);

        if (!bids[p]) bids[p] = 0;

        // weight by venue reliability implicitly later
        bids[p] += Number(size || 0);
      }

      // ---------------------
      // ASKS
      // ---------------------
      for (const [price, size] of (book.asks || [])) {

        const p = Number(price);

        if (!asks[p]) asks[p] = 0;

        asks[p] += Number(size || 0);
      }
    }

    this.normalized.bids = bids;
    this.normalized.asks = asks;
  }

  // =====================================================
  // GLOBAL MID PRICE
  // =====================================================
  midPrice() {

    const bidPrices = Object.keys(this.normalized.bids).map(Number);
    const askPrices = Object.keys(this.normalized.asks).map(Number);

    if (!bidPrices.length || !askPrices.length) return 0;

    const bestBid = Math.max(...bidPrices);
    const bestAsk = Math.min(...askPrices);

    return (bestBid + bestAsk) / 2;
  }

  // =====================================================
  // LIQUIDITY IMBALANCE MAP
  // =====================================================
  imbalance() {

    let bidVol = 0;
    let askVol = 0;

    for (const p in this.normalized.bids) {
      bidVol += this.normalized.bids[p];
    }

    for (const p in this.normalized.asks) {
      askVol += this.normalized.asks[p];
    }

    const total = bidVol + askVol;

    if (total === 0) return 0;

    return (bidVol - askVol) / total;
  }

  // =====================================================
  // DEPTH HEAT ZONES (LIQUIDITY CLUSTERS)
  // =====================================================
  heatmap() {

    const zones = [];

    for (const p in this.normalized.bids) {

      const size = this.normalized.bids[p];

      if (size > 0) {
        zones.push({
          price: Number(p),
          type: "bid",
          strength: size
        });
      }
    }

    for (const p in this.normalized.asks) {

      const size = this.normalized.asks[p];

      if (size > 0) {
        zones.push({
          price: Number(p),
          type: "ask",
          strength: size
        });
      }
    }

    return zones.sort((a, b) => b.strength - a.strength);
  }

  // =====================================================
  // GLOBAL LIQUIDITY STRESS SCORE
  // =====================================================
  stress() {

    const imbalance = this.imbalance();
    const totalLevels =
      Object.keys(this.normalized.bids).length +
      Object.keys(this.normalized.asks).length;

    const fragmentationPenalty =
      totalLevels > 200 ? 0.2 : 0;

    return Math.abs(imbalance) + fragmentationPenalty;
  }

  // =====================================================
  // FULL SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      mid: this.midPrice(),
      imbalance: this.imbalance(),
      stress: this.stress(),
      heatmap: this.heatmap()
    };
  }
}

module.exports = LiquidityFusionV33;
