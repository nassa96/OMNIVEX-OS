export class OmnivexWS {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = {};
    this.reconnectDelay = 2000;
    this.shouldReconnect = true;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[WS] CONNECTED");
    };

    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);

        const handlers = this.listeners[data.type] || [];
        handlers.forEach((fn) => fn(data.payload));
      } catch (e) {
        console.error("[WS] PARSE ERROR", e);
      }
    };

    this.ws.onclose = () => {
      console.log("[WS] DISCONNECTED");

      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectDelay);
      }
    };
  }

  on(type, fn) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(fn);
  }

  close() {
    this.shouldReconnect = false;
    this.ws?.close();
  }
}
