export const connectWS = (onEvent) => {
  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("WS CONNECTED");
  };

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    onEvent(data);
  };

  ws.onerror = (e) => console.log("WS ERROR", e);

  return ws;
};
