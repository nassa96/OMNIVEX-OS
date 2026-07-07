export function createSocket(onMessage) {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("GRID CONNECTED");
  };

  ws.onmessage = (msg) => {
    try {
      onMessage(JSON.parse(msg.data));
    } catch (e) {}
  };

  ws.onclose = () => {
    console.log("GRID DISCONNECTED");
  };

  return ws;
}
