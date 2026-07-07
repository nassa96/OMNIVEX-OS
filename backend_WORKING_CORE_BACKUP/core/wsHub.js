import { WebSocketServer } from "ws";

let wss;

export function initWS(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    socket.send(
      JSON.stringify({
        type: "WS_CONNECTED",
        system: "OMNIVEX_ATLAS_STREAM",
        ts: Date.now(),
      })
    );
  });
}

export function broadcast(event) {
  if (!wss) return;

  const payload = JSON.stringify(event);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}
