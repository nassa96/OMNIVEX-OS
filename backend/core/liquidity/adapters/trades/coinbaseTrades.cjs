const WebSocket = require("ws");

/**
 * SAINT V7 — COINBASE TRADE FEED
 * real executed trades
 */

class CoinbaseTrades {

  connect(onTrade) {

    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    ws.on("open", () => {
      ws.send(JSON.stringify({
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["matches"]
      }));
    });

    ws.on("message", (msg) => {

      try {
        const t = JSON.parse(msg.toString());

        if (t.type !== "match") return;

        onTrade({
          venue: "coinbase",
          price: parseFloat(t.price),
          size: parseFloat(t.size),
          side: t.side,
          ts: Date.parse(t.time)
        });

      } catch (e) {}
    });

    ws.on("error", (err) => {
      console.log("[COINBASE TRADES ERROR]", err.message);
    });

    return ws;
  }
}

module.exports = CoinbaseTrades;
