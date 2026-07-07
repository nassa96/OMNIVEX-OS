const WebSocket = require("ws");

class AtlasWebsocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Set();
  }

  start() {
    this.wss.on("connection", (ws) => {
      console.log("[ATLAS WS] client connected");
      this.clients.add(ws);

      ws.on("close", () => {
        this.clients.delete(ws);
      });
    });
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

module.exports = AtlasWebsocketServer;
