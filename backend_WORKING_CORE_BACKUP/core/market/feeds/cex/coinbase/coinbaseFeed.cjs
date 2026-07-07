const WebSocket = require("ws");

class CoinbaseFeed {
  constructor(bus) {
    this.bus = bus;
    this.ws = null;
  }

  start() {
    console.log("[COINBASE FEED] starting...");

    this.ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    this.ws.on("open", () => {
      this.ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["ticker"]
      }));
    });

    this.ws.on("message", (raw) => {
      const data = JSON.parse(raw);

      const event = {
        source: "coinbase",
        symbol: data.product_id,
        price: Number(data.price || 0),
        volume: Number(data.last_size || 0),
        change: 0,
        timestamp: Date.now()
      };

      this.bus.publish(event);
    });

    this.ws.on("error", (err) => {
      console.log("[COINBASE ERROR]", err.message);
    });
  }
}

module.exports = CoinbaseFeed;
