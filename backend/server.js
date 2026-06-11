import dotenv from "dotenv";
import path from "path";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";

import { runSophia } from "./agents/sophia/index.js";
import { runAegis } from "./agents/aegis/index.js";
import { runSaint } from "./agents/saint/index.js";
import { runElohim } from "./agents/elohim/index.js";

import { writeCheckpoint } from "./services/supabase.js";

// ---------------- ENV LOAD (ROBUST) ----------------
dotenv.config({ path: path.resolve("./.env") });

// ---------------- CORE INIT ----------------
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());

const PORT = process.env.PORT || 3000;

// ---------------- STATE ----------------
let state = {
  BTC: null,
  ETH: null,
  signal: "INIT",
  confidence: 0,
  risk: "UNKNOWN",
  allow: false
};

// ---------------- HEALTH CHECK ----------------
app.get("/api/ping", (req, res) => {
  res.json({
    status: "ok",
    system: "SAINT_PRIMAL",
    signal: state.signal,
    confidence: state.confidence
  });
});

// ---------------- BROADCAST ----------------
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

// ---------------- MAIN TICK ----------------
async function tick() {
  try {
    // 1. MARKET DATA
    const market = await runElohim();

    // 2. SIGNAL GENERATION
    const signal = runSophia(market);

    // 3. RISK CHECK
    const risk = runAegis(signal);

    // 4. EXECUTION DECISION
    const allow = risk.allow && signal.confidence > 0.7;

    const packet = {
      type: "TICK",
      market,
      signal: signal.signal,
      confidence: signal.confidence,
      risk: risk.level,
      allow,
      timestamp: Date.now()
    };

    // 5. UPDATE STATE
    state = { ...state, ...packet };

    // 6. LOG
    console.log(
      `[${new Date().toISOString()}]`,
      `SIGNAL=${signal.signal}`,
      `CONF=${signal.confidence.toFixed(2)}`,
      `RISK=${risk.level}`,
      `ALLOW=${allow}`
    );

    // 7. CHECKPOINT (SAFE)
    await writeCheckpoint(packet);

    // 8. BROADCAST
    broadcast(packet);

  } catch (err) {
    console.log("TICK ERROR:", err.message);
  }
}

// ---------------- LOOP ----------------
setInterval(tick, 2000);

// ---------------- WEBSOCKET ----------------
wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "CONNECTED", system: "SAINT_PRIMAL" }));
});

// ---------------- START SERVER ----------------
server.listen(PORT, () => {
  console.log(`ATLAS BOOTSTRAP RUNNING ON PORT ${PORT}`);
});
