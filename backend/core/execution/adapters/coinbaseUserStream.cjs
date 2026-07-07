const WebSocket = require("ws");

class CoinbaseUserStream {
  constructor() {
    this.ws = null;
  }

  connect(productId, handler) {
    this.ws = new WebSocket("wss://advanced-trade-ws.coinbase.com");

    this.ws.on("open", () => {
      console.log("[COINBASE] connected");

      this.ws.send(JSON.stringify({
        type: "subscribe",
        channel: "user",
        product_ids: [productId]
      }));
    });

    this.ws.on("message", (raw) => {
      const msg = JSON.parse(raw);

      if (msg.type === "order_update") {
        handler({
          exchange: "coinbase",
          orderId: msg.order_id,
          clientOrderId: msg.client_order_id,
          status: msg.status,
          fillQty: Number(msg.filled_size || 0),
          fillPrice: Number(msg.average_filled_price || 0),
          raw: msg
        });
      }
    });

    this.ws.on("close", () => {
      console.log("[COINBASE] disconnected");
    });
  }
}

module.exports = CoinbaseUserStream;
