const WebSocket = require("ws");

class KrakenWS {

  constructor(pair = "XBT/USD") {
    this.pair = pair;
    this.ws = null;
  }

  connect(onUpdate) {

    const url = "wss://ws.kraken.com";

    this.ws = new WebSocket(url);

    this.ws.on("open", () => {
      console.log("[KRAKEN WS] connected");

      this.ws.send(JSON.stringify({
        event: "subscribe",
        pair: [this.pair],
        subscription: { name: "book" }
      }));
    });

    this.ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw);

        if (!Array.isArray(msg)) return;

        const data = msg[1];
        if (!data) return;

        const bids = [];
        const asks = [];

        if (data.b) {
          for (const [p, s] of Object.entries(data.b)) {
            bids.push([parseFloat(p), parseFloat(s)]);
          }
        }

        if (data.a) {
          for (const [p, s] of Object.entries(data.a)) {
            asks.push([parseFloat(p), parseFloat(s)]);
          }
        }

        onUpdate?.({
          bids,
          asks,
          ts: Date.now()
        });

      } catch (e) {}
    });
  }
}

module.exports = KrakenWS;
