"use strict";

import EventEmitter from "events";

class MarketFeed extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
  }

  start() {
    console.log("[MARKET] Starting feed...");

    const url = "wss://stream.binance.us:9443/ws/btcusdt@trade";

    this.ws = new WebSocket(url);

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      this.emit("tick", {
        price: parseFloat(data.p),
        source: "BINANCE_US",
        timestamp: Date.now()
      });
    };

    this.ws.onerror = (e) => console.log("[WS ERROR]", e.message);
  }

  stop() {
    this.ws?.close();
  }
}

export default new MarketFeed();
