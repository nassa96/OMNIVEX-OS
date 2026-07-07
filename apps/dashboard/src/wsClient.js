class WSClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = [];
    this.reconnectDelay = 2000;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("[ATLAS WS] CONNECTED");
    };

    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        this.emit(data);
      } catch (e) {
        console.error("[WS PARSE ERROR]", e);
      }
    };

    this.ws.onclose = () => {
      console.log("[ATLAS WS] DISCONNECTED - RECONNECTING");
      setTimeout(() => this.connect(), this.reconnectDelay);
    };

    this.ws.onerror = (err) => {
      console.error("[ATLAS WS ERROR]", err.message);
    };
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  emit(data) {
    for (const fn of this.listeners) {
      fn(data);
    }
  }
}

export const wsClient = new WSClient("ws://localhost:3000");
