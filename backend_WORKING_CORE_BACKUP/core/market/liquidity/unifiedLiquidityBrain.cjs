class UnifiedLiquidityBrain {
  constructor(bus) {
    this.bus = bus;

    this.books = {
      binance: null,
      coinbase: null
    };

    this.state = {
      spread: null,
      imbalance: 0,
      mid: null
    };

    this.bus.on("book", (book) => this.ingest(book));
  }

  ingest(book) {
    this.books[book.exchange] = book;

    this.recompute();
  }

  normalize(book) {
    const bids = book.bids.map(b => parseFloat(b[0] || b.price || 0));
    const asks = book.asks.map(a => parseFloat(a[0] || a.price || 0));

    return { bids, asks };
  }

  recompute() {
    const allBids = [];
    const allAsks = [];

    for (const ex of Object.keys(this.books)) {
      const book = this.books[ex];
      if (!book) continue;

      const norm = this.normalize(book);

      allBids.push(...norm.bids);
      allAsks.push(...norm.asks);
    }

    if (!allBids.length || !allAsks.length) return;

    const bestBid = Math.max(...allBids);
    const bestAsk = Math.min(...allAsks);

    const mid = (bestBid + bestAsk) / 2;
    const spread = bestAsk - bestBid;

    const imbalance =
      allBids.length / (allAsks.length + 1);

    this.state = {
      mid,
      spread,
      imbalance
    };

    this.bus.emit("liquidity:update", this.state);
  }

  getState() {
    return this.state;
  }
}

module.exports = UnifiedLiquidityBrain;
