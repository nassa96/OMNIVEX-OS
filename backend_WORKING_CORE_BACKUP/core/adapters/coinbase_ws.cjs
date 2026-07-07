const WebSocket = require("ws");
const EventEmitter = require("events");

class CoinbaseWS extends EventEmitter {
  constructor(product = "BTC-USD") {
    super();
    this.product = product;
    this.ws = null;
  }

  connect() {
    this.ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    this.ws.on("open", () => {
      console.log("[COINBASE WS] connected");

      this.ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: [this.product],
        channels: ["level2"]
      }));
    });

    this.ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (!msg.changes) return;

        const bids = [];
        const asks = [];

        for (const c of msg.changes) {
          const [side, price, size] = c;

          if (side === "buy") bids.push([price, size]);
          if (side === "sell") asks.push([price, size]);
        }

        this.emit("book", {
          symbol: this.product,
          bids,
          asks,
          ts: Date.now()
        });

      } catch (e) {
        console.log("[COINBASE WS] parse error", e.message);
      }
    });

    this.ws.on("close", () => {
      console.log("[COINBASE WS] closed");
    });

    this.ws.on("error", (e) => {
      console.log("[COINBASE WS] error", e.message);
    });
  }
}

module.exports = CoinbaseWS;
