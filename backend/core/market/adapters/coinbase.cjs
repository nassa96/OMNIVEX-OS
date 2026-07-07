const WebSocket = require("ws");

class CoinbaseAdapter {
  constructor(bus) {
    this.bus = bus;
  }

  connect() {
    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    ws.on("open", () => {
      ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2"]
      }));

      console.log("[COINBASE] connected");
    });

    ws.on("message", (msg) => {
      const raw = JSON.parse(msg);

      if (!raw.changes) return;

      const book = {
        exchange: "coinbase",
        symbol: "BTC",
        bids: raw.changes.filter(c => c[0] === "buy"),
        asks: raw.changes.filter(c => c[0] === "sell"),
        ts: Date.now()
      };

      this.bus.emitBook(book);
    });

    ws.on("close", () => console.log("[COINBASE] closed"));
  }
}

module.exports = CoinbaseAdapter;
