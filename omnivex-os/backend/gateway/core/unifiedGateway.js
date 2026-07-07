import http from "http";
import { initWsBridge } from "../../bridge/wsBridge.js";

/**
 * UNIFIED OMNIVEX GATEWAY
 * Single ingress/egress controller for the entire system
 */

export function createUnifiedGateway({ app, bus, config }) {
  const server = http.createServer(app);

  // =========================
  // WS LAYER
  // =========================
  const ws = initWsBridge(bus, {
    port: config.WS_PORT || 8080
  });

  // =========================
  // HTTP START
  // =========================
  const httpPort = config.PORT || 3000;

  server.listen(httpPort, () => {
    console.log(`🌐 OMNIVEX GATEWAY ONLINE`);
    console.log(`→ HTTP: http://localhost:${httpPort}`);
    console.log(`→ WS:   ws://localhost:${config.WS_PORT || 8080}`);
  });

  // =========================
  // HEALTH CONTRACT
  // =========================
  function health() {
    return {
      status: "RUNNING",
      http: httpPort,
      ws: config.WS_PORT || 8080,
      clients: ws.clients(),
      uptime: process.uptime()
    };
  }

  return {
    server,
    ws,
    health
  };
}
