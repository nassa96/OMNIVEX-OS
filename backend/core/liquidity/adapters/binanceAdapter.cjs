const WebSocket = require("ws");

class BinanceAdapter {

  connect(onUpdate) {

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@depth"
    );

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg.toString());

        onUpdate({
          exchange: "binance",
          bids: data.b || [],
          asks: data.a || [],
          ts: Date.now()
        });

      } catch (e) {}
    });

    return ws;
  }
}

module.exports = BinanceAdapter;
