import { WebSocketServer } from "ws";

let wss = null;

export function initWebSocket(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
      type: "SYSTEM",
      message: "OMNIVEX STREAM CONNECTED"
    }));
  });

  return wss;
}

export function broadcast(payload) {
  if (!wss) return;

  const data = JSON.stringify(payload);

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
}
