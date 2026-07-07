const WebSocket = require("ws");

class BinanceUserStream {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.ws = null;
    this.onEvent = null;
  }

  connect(listenKey, handler) {
    this.onEvent = handler;

    const url = `wss://stream.binance.com:9443/ws/${listenKey}`;

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[BINANCE] user stream connected");
    });

    this.ws.on("message", (raw) => {
      const event = JSON.parse(raw);

      // normalize Binance order update
      if (event.e === "executionReport") {
        handler({
          exchange: "binance",
          orderId: event.i,
          clientOrderId: event.c,
          status: this._mapStatus(event.X),
          fillQty: Number(event.l || 0),
          fillPrice: Number(event.L || 0),
          raw: event
        });
      }
    });

    this.ws.on("close", () => {
      console.log("[BINANCE] user stream closed");
    });
  }

  _mapStatus(status) {
    const map = {
      NEW: "NEW",
      PARTIALLY_FILLED: "PARTIALLY_FILLED",
      FILLED: "FILLED",
      CANCELED: "CANCELED",
      REJECTED: "REJECTED"
    };

    return map[status] || status;
  }
}

module.exports = BinanceUserStream;
