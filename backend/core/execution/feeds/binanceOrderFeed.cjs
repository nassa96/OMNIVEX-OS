/**
 * SAINT V15 — BINANCE ORDER FEED
 * ------------------------------
 * Streams real-time order updates (fills, partial fills, cancels)
 */

const WebSocket = require("ws");

class BinanceOrderFeed {

  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = null;
  }

  connect(listenKey, onUpdate) {

    const url =
      `wss://stream.binance.com:9443/ws/${listenKey}`;

    this.ws = new WebSocket(url);

    this.ws.on("message", (msg) => {

      try {
        const event = JSON.parse(msg.toString());

        if (!event || !event.e) return;

        onUpdate({
          venue: "binance",
          type: event.e, // ORDER_TRADE_UPDATE
          orderId: event.o?.i,
          status: event.o?.X, // NEW, FILLED, PARTIALLY_FILLED
          filledQty: event.o?.z,
          avgPrice: event.o?.L,
          symbol: event.o?.s,
          ts: event.E
        });

      } catch (err) {
        console.log("[BINANCE FEED ERROR]", err.message);
      }
    });

    this.ws.on("error", (err) => {
      console.log("[BINANCE WS ERROR]", err.message);
    });

    return this.ws;
  }
}

module.exports = BinanceOrderFeed;
