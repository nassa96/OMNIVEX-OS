class AtlasSocket {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
  }

  connect() {
    this.ws = new WebSocket("ws://localhost:3000");

    this.ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      this.listeners.forEach((cb) => cb(data));
    };

    this.ws.onopen = () => {
      console.log("[ATLAS FRONTEND] connected");
    };
  }

  subscribe(cb) {
    this.listeners.add(cb);
  }
}

export default new AtlasSocket();
