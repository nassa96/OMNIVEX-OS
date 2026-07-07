const WebSocket = require("ws");

/**
 * SAINT V51 — COINBASE WS ADAPTER
 */

class CoinbaseWSV51 {

  constructor(bus) {
    this.bus = bus;
    this.ws = null;
  }

  connect() {

    this.ws = new WebSocket(
      "wss://ws-feed.exchange.coinbase.com"
    );

    this.ws.on("open", () => {

      this.ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD", "ETH-USD"],
        channels: ["ticker"]
      }));
    });

    this.ws.on("message", (msg) => {

      try {
        const data = JSON.parse(msg);

        if (data.type !== "ticker") return;

        this.bus.updatePrice(
          data.product_id,
          parseFloat(data.price),
          "COINBASE"
        );

      } catch (e) {}
    });

    this.ws.on("error", (err) => {
      console.log("[COINBASE WS ERROR]", err.message);
    });
  }
}

module.exports = CoinbaseWSV51;
