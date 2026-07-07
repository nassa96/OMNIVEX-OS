"use strict";

/**
 * ==========================================
 * SAINT_PRIMAL DASHBOARD SERVER v1
 * REAL-TIME CONTROL CENTER STREAM
 * ==========================================
 */

import { WebSocketServer } from "ws";
import telemetry from "../telemetry/telemetryHub.js";

let wss = null;

/**
 * ==========================
 * START DASHBOARD SERVER
 * ==========================
 */
export function startDashboardServer(port = 8081) {
  wss = new WebSocketServer({ port });

  console.log(`[DASHBOARD] LIVE ON ws://localhost:${port}`);

  wss.on("connection", (ws) => {
    console.log("[DASHBOARD] CLIENT CONNECTED");

    telemetry.subscribe(ws);

    ws.send(
      JSON.stringify({
        type: "BOOT",
        message: "SAINT_PRIMAL TELEMETRY ACTIVE"
      })
    );
  });

  return wss;
}

export default {
  startDashboardServer
};
