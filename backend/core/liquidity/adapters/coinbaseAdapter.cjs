const WebSocket = require("ws");

class CoinbaseAdapter {

  connect(onUpdate) {

    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    ws.on("open", () => {
      ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["level2"]
      }));
    });

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        if (data.type !== "snapshot" && data.type !== "l2update") return;

        onUpdate({
          exchange: "coinbase",
          raw: data,
          ts: Date.now()
        });

      } catch (e) {}
    });

    return ws;
  }
}

module.exports = CoinbaseAdapter;
