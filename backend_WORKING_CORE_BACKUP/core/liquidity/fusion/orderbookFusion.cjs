/**
 * SAINT V3 — UNIFIED ORDERBOOK FUSION ENGINE
 * ------------------------------------------
 * Converts multi-venue liquidity → single synthetic orderbook
 */

class OrderbookFusion {

  constructor() {
    this.fused = {
      bids: new Map(), // price -> size
      asks: new Map()
    };
  }

  // ---------------------------
  // INGEST NORMALIZED BOOK
  // ---------------------------
  ingest(book) {

    if (!book || !book.bids || !book.asks) return;

    this.mergeSide(this.fused.bids, book.bids, "bid");
    this.mergeSide(this.fused.asks, book.asks, "ask");
  }

  // ---------------------------
  // MERGE LIQUIDITY LEVELS
  // ---------------------------
  mergeSide(map, levels, side) {

    for (const l of levels) {

      const price = Number(l.price);
      const size = Number(l.size);

      if (!price || !size) continue;

      const existing = map.get(price) || 0;

      map.set(price, existing + size);
    }
  }

  // ---------------------------
  // BEST BID / ASK EXTRACTION
  // ---------------------------
  getTopOfBook() {

    const bids = Array.from(this.fused.bids.entries())
      .sort((a,b)=>b[0]-a[0]);

    const asks = Array.from(this.fused.asks.entries())
      .sort((a,b)=>a[0]-b[0]);

    return {
      bestBid: bids[0] || null,
      bestAsk: asks[0] || null
    };
  }

  // ---------------------------
  // SPREAD ANALYSIS
  // ---------------------------
  getSpread() {

    const top = this.getTopOfBook();

    if (!top.bestBid || !top.bestAsk) {
      return null;
    }

    const bid = top.bestBid[0];
    const ask = top.bestAsk[0];

    return {
      spread: ask - bid,
      mid: (ask + bid) / 2,
      bid,
      ask
    };
  }

  // ---------------------------
  // LIQUIDITY DEPTH SCORE
  // ---------------------------
  getDepthScore() {

    const bidDepth = Array.from(this.fused.bids.values())
      .reduce((a,b)=>a+b,0);

    const askDepth = Array.from(this.fused.asks.values())
      .reduce((a,b)=>a+b,0);

    return {
      bidDepth,
      askDepth,
      totalDepth: bidDepth + askDepth,
      imbalance: Math.abs(bidDepth - askDepth)
    };
  }

  // ---------------------------
  // CLEAR (NEW CYCLE)
  // ---------------------------
  reset() {
    this.fused.bids.clear();
    this.fused.asks.clear();
  }
}

module.exports = OrderbookFusion;
