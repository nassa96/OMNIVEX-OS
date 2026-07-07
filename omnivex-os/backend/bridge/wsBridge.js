import { WebSocketServer } from "ws";
import crypto from "crypto";

/**
 * OMNIVEX OS PRIME — WS BRIDGE (STABLE)
 * Bridges EventBus → WebSocket clients
 */

export function initWsBridge(bus, { port = 8080 } = {}) {
  const wss = new WebSocketServer({ port });
  const clients = new Set();

  console.log(`🌉 WS BRIDGE ONLINE → ws://localhost:${port}`);

  wss.on("connection", (ws) => {
    const clientId = crypto.randomUUID();
    clients.add(ws);

    ws.send(
      JSON.stringify({
        type: "bridge.connected",
        id: clientId,
        timestamp: Date.now(),
        payload: {}
      })
    );

    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        bus.emit("ws.inbound", {
          source: "wsBridge",
          payload: msg
        });
      } catch (err) {
        ws.send(
          JSON.stringify({
            type: "bridge.error",
            payload: { message: "invalid_json" },
            timestamp: Date.now()
          })
        );
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
    });
  });

  const broadcast = (event) => {
    const payload = JSON.stringify(event);

    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  };

  /**
   * HARD ROUTED EVENT SUBSCRIPTIONS
   * No onAny dependency. Fully deterministic.
   */

  const EVENTS = [
    "market.tick",
    "trade.executed",
    "signal",
    "risk",
    "ws.inbound",
    "system.health"
  ];

  for (const type of EVENTS) {
    bus.on(type, (event) => {
      broadcast({
        type,
        ...event
      });
    });
  }

  return {
    wss,
    broadcast,
    clients: () => clients.size
  };
}
