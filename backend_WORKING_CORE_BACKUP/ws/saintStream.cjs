class SaintStream {
  constructor() {
    this.clients = new Set();
  }

  attach(server) {
    const WebSocket = require("ws");
    this.wss = new WebSocket.Server({ server });

    this.wss.on("connection", (ws) => {
      this.clients.add(ws);

      ws.on("close", () => {
        this.clients.delete(ws);
      });
    });

    console.log("[WS] SAINT STREAM ACTIVE");
  }

  broadcast(data) {
    const payload = JSON.stringify(data);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  }
}

module.exports = new SaintStream();
