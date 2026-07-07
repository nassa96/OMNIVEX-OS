const WebSocket = require("ws");

class SafeWS {

  constructor(url, name) {
    this.url = url;
    this.name = name;
  }

  connect(onMessage) {

    try {
      const ws = new WebSocket(this.url);

      ws.on("open", () => {
        console.log(`[${this.name}] connected`);
      });

      ws.on("message", onMessage);

      ws.on("error", (err) => {
        console.log(`[${this.name}] WS error:`, err.message);
      });

      ws.on("close", () => {
        console.log(`[${this.name}] closed`);
      });

      return ws;

    } catch (e) {
      console.log(`[${this.name}] failed to init:`, e.message);
      return null;
    }
  }
}

module.exports = SafeWS;
