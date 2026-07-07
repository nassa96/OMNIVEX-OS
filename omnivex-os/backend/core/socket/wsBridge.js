const WebSocket = require("ws");

class WSBridge {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);

      ws.on("close", () => {
        this.clients.delete(ws);
      });
    });
  }

  broadcast(type, payload) {
    const msg = JSON.stringify({
      type,
      payload,
      ts: Date.now(),
    });

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(msg);
      }
    }
  }
}

module.exports = WSBridge;
