const WebSocket = require("ws");

class CoinbaseWS {

  constructor(product = "BTC-USD") {
    this.product = product;
    this.ws = null;
  }

  connect(onUpdate) {

    const url = "wss://ws-feed.exchange.coinbase.com";

    this.ws = new WebSocket(url);

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
        const msg = JSON.parse(raw);

        if (!msg.changes) return;

        const bids = [];
        const asks = [];

        for (const [side, price, size] of msg.changes) {
          if (side === "buy") bids.push([parseFloat(price), parseFloat(size)]);
          if (side === "sell") asks.push([parseFloat(price), parseFloat(size)]);
        }

        const market = {
          bids,
          asks,
          ts: Date.now()
        };

        onUpdate?.(market);

      } catch (e) {}
    });
  }
}

module.exports = CoinbaseWS;
