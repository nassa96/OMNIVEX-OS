/**
 * OMNIVEX STREAM CLIENT
 * Connects frontend to backend WebSocket feed
 */

class OmnivexStream {
  constructor(url = "ws://localhost:8080") {
    this.url = url;
    this.ws = null;
    this.listeners = new Map();
    this.connected = false;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.connected = true;
      console.log("🟢 OMNIVEX STREAM CONNECTED");
      this._emit("connection.open", {});
    };

    this.ws.onmessage = (msg) => {
      try {
        const data = JSON.parse(msg.data);
        this._emit(data.type, data);
        this._emit("*", data); // global stream
      } catch (err) {
        console.error("Stream parse error:", err);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      console.log("🔴 OMNIVEX STREAM DISCONNECTED");

      setTimeout(() => this.connect(), 2000);
    };
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }

    this.listeners.get(eventType).push(callback);
  }

  _emit(eventType, data) {
    const subs = this.listeners.get(eventType);
    if (!subs) return;

    subs.forEach(fn => fn(data));
  }

  send(type, payload) {
    if (!this.connected) return;

    this.ws.send(JSON.stringify({ type, payload }));
  }
}

export const omnivexStream = new OmnivexStream();
