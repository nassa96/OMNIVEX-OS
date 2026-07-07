export function connectWS(onEvent) {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => console.log("ATLAS WS CONNECTED");

  ws.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);
      onEvent(data);
    } catch {}
  };

  return ws;
}
