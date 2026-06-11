import { WebSocketServer } from "ws";

export function startWS(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", ws => {
    ws.send(JSON.stringify({ type: "CONNECTED" }));
  });

  console.log("WS ONLINE");
}
