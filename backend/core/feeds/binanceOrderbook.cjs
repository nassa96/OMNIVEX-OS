const WebSocket = require("ws");

class BinanceOrderbook {
  constructor(symbol = "btcusdt") {
    this.symbol = symbol.toLowerCase();
    this.ws = null;
    this.book = {
      bids: new Map(),
      asks: new Map(),
      lastUpdate: null
    };
  }

  connect(onUpdate) {
    const url = `wss://stream.binance.com:9443/ws/${this.symbol}@depth20@100ms`;

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[BINANCE] Orderbook stream connected");
    });

    this.ws.on("message", (raw) => {
      const msg = JSON.parse(raw);

      if (msg.bids) {
        msg.bids.forEach(([p, q]) => {
          this.book.bids.set(parseFloat(p), parseFloat(q));
        });
      }

      if (msg.asks) {
        msg.asks.forEach(([p, q]) => {
          this.book.asks.set(parseFloat(p), parseFloat(q));
        });
      }

      this.book.lastUpdate = Date.now();

      onUpdate(this.snapshot());
    });

    this.ws.on("close", () => {
      console.log("[BINANCE] Orderbook stream closed");
    });

    this.ws.on("error", (err) => {
      console.log("[BINANCE] WS error:", err.message);
    });
  }

  snapshot() {
    const bestBid = Math.max(...this.book.bids.keys());
    const bestAsk = Math.min(...this.book.asks.keys());

    return {
      symbol: this.symbol,
      bids: [...this.book.bids.entries()],
      asks: [...this.book.asks.entries()],
      bestBid,
      bestAsk,
      spread: bestAsk - bestBid,
      mid: (bestBid + bestAsk) / 2,
      ts: Date.now()
    };
  }
}

module.exports = BinanceOrderbook;
