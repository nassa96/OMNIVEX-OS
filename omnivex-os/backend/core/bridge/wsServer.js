import { WebSocketServer } from "ws";

let wss;

/**
 * INIT WS SERVER
 */
export function initWS(server) {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
      type: "WS_CONNECTED",
      source: "SYSTEM",
      ts: Date.now()
    }));
  });
}

/**
 * UNIFIED BROADCAST LAYER
 */
export function broadcast(event = {}) {
  if (!wss) return;

  const normalized = normalize(event);

  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(JSON.stringify(normalized));
    }
  }
}

/**
 * SCHEMA NORMALIZER (CRITICAL FIX)
 */
function normalize(event) {
  return {
    type: event.type || "UNKNOWN",
    symbol: event.symbol || "N/A",
    price: typeof event.price === "number" ? event.price : null,
    ts: event.ts || Date.now(),
    source: event.source || "SYSTEM",
    regime: event.regime || null,
    size: event.size || null,
    action: event.action || null
  };
}
