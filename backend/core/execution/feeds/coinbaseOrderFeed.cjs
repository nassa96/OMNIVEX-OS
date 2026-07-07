/**
 * SAINT V15 — COINBASE ORDER FEED
 * -------------------------------
 * Streams execution updates via websocket
 */

const WebSocket = require("ws");

class CoinbaseOrderFeed {

  constructor() {
    this.ws = null;
  }

  connect(onUpdate) {

    this.ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    this.ws.on("open", () => {

      this.ws.send(JSON.stringify({
        type: "subscribe",
        channels: ["user"],
        product_ids: ["BTC-USD"]
      }));
    });

    this.ws.on("message", (msg) => {

      try {

        const event = JSON.parse(msg.toString());

        if (!event.type) return;

        onUpdate({
          venue: "coinbase",
          type: event.type,
          orderId: event.order_id,
          status: event.reason || event.status,
          filledQty: event.filled_size,
          remaining: event.remaining_size,
          price: event.price,
          ts: Date.parse(event.time || Date.now())
        });

      } catch (err) {
        console.log("[COINBASE FEED ERROR]", err.message);
      }
    });

    return this.ws;
  }
}

module.exports = CoinbaseOrderFeed;
