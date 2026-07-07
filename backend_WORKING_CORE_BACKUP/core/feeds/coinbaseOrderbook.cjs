const WebSocket = require("ws");

class CoinbaseOrderbook {
  constructor(product = "BTC-USD") {
    this.product = product;
    this.ws = null;

    this.book = {
      bids: new Map(),
      asks: new Map()
    };
  }

  connect(onUpdate) {
    this.ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    this.ws.on("open", () => {
      this.ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: [this.product],
        channels: ["level2"]
      }));

      console.log("[COINBASE] WS connected");
    });

    this.ws.on("message", (raw) => {
      const msg = JSON.parse(raw);

      if (!msg.changes) return;

      msg.changes.forEach(([side, price, size]) => {
        const p = parseFloat(price);
        const q = parseFloat(size);

        if (side === "buy") this.book.bids.set(p, q);
        if (side === "sell") this.book.asks.set(p, q);
      });

      const bestBid = Math.max(...this.book.bids.keys());
      const bestAsk = Math.min(...this.book.asks.keys());

      onUpdate({
        symbol: this.product,
        bestBid,
        bestAsk,
        spread: bestAsk - bestBid,
        mid: (bestBid + bestAsk) / 2,
        ts: Date.now()
      });
    });

    this.ws.on("close", () => console.log("[COINBASE] closed"));
  }
}

module.exports = CoinbaseOrderbook;
