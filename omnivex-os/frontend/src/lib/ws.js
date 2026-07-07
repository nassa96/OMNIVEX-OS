export function createWS(onMessage) {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("[WS] CONNECTED");
    ws.send(JSON.stringify({ type: "PING" }));
  };

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      onMessage(data);
    } catch (e) {
      console.error("[WS PARSE ERROR]", e);
    }
  };

  ws.onerror = (err) => {
    console.error("[WS ERROR]", err);
  };

  return ws;
}
