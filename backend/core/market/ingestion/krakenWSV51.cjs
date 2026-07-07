const WebSocket = require("ws");

/**
 * SAINT V51 — KRAKEN WS ADAPTER
 */

class KrakenWSV51 {

  constructor(bus) {
    this.bus = bus;
    this.ws = null;
    this.reconnectDelay = 2000;
  }

  connect() {

    this.ws = new WebSocket("wss://ws.kraken.com");

    this.ws.on("open", () => {

      this.ws.send(JSON.stringify({
        event: "subscribe",
        pair: ["ETH/USD", "BTC/USD"],
        subscription: {
          name: "ticker"
        }
      }));
    });

    this.ws.on("message", (msg) => {

      try {

        const data = JSON.parse(msg);

        // Kraken sends arrays for ticker updates
        if (Array.isArray(data) && data[1]?.c) {

          const price = parseFloat(data[1].c[0]);
          const symbol = data[3];

          this.bus.updatePrice(symbol, price, "KRAKEN");
        }

      } catch (e) {}
    });

    this.ws.on("close", () => {

      console.log("[KRAKEN WS CLOSED] reconnecting...");

      setTimeout(() => this.connect(), this.reconnectDelay);
    });

    this.ws.on("error", (err) => {
      console.log("[KRAKEN WS ERROR]", err.message);
    });
  }
}

module.exports = KrakenWSV51;
