/**
 * SAINT V32 — EXCHANGE ISOLATED ORDERBOOK
 * ----------------------------------------
 * Maintains true per-exchange market state:
 * - bids/asks
 * - spread
 * - liquidity
 * - last update
 */

class ExchangeBook {

  constructor(name) {
    this.name = name;

    this.bids = new Map();
    this.asks = new Map();

    this.lastPrice = 0;
    this.lastUpdate = 0;
  }

  update(orderbook) {

    // EXPECTED RAW FORMAT:
    // { bids: [[price, size]], asks: [[price, size]] }

    if (orderbook.bids) {
      for (const [p, s] of orderbook.bids) {
        this.bids.set(parseFloat(p), parseFloat(s));
      }
    }

    if (orderbook.asks) {
      for (const [p, s] of orderbook.asks) {
        this.asks.set(parseFloat(p), parseFloat(s));
      }
    }

    const bestBid = Math.max(...this.bids.keys(), 0);
    const bestAsk = Math.min(...this.asks.keys(), Infinity);

    this.lastPrice = (bestBid + bestAsk) / 2;
    this.lastUpdate = Date.now();
  }

  snapshot() {

    const bids = [...this.bids.entries()]
      .sort((a,b)=>b[0]-a[0])
      .slice(0, 20);

    const asks = [...this.asks.entries()]
      .sort((a,b)=>a[0]-b[0])
      .slice(0, 20);

    const bestBid = bids[0]?.[0] || 0;
    const bestAsk = asks[0]?.[0] || 0;

    const spread = bestAsk - bestBid;

    const liquidity =
      bids.reduce((a,b)=>a+b[1],0) +
      asks.reduce((a,b)=>a+b[1],0);

    return {
      exchange: this.name,
      bids,
      asks,
      bestBid,
      bestAsk,
      spread,
      liquidity,
      mid: this.lastPrice,
      ts: this.lastUpdate
    };
  }
}

module.exports = ExchangeBook;
