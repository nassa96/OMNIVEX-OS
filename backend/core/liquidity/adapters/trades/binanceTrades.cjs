const WebSocket = require("ws");

/**
 * SAINT V7 — BINANCE REAL TRADE FEED
 * aggTrades = actual executed market trades
 */

class BinanceTrades {

  connect(onTrade) {

    const ws = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@aggTrade"
    );

    ws.on("message", (msg) => {

      try {
        const t = JSON.parse(msg.toString());

        onTrade({
          venue: "binance",
          price: parseFloat(t.p),
          size: parseFloat(t.q),
          side: t.m ? "sell" : "buy", // m = buyer is maker
          ts: t.T
        });

      } catch (e) {}
    });

    ws.on("error", (err) => {
      console.log("[BINANCE TRADES ERROR]", err.message);
    });

    return ws;
  }
}

module.exports = BinanceTrades;
