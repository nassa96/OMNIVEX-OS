import express from "express";
import http from "http";
import cors from "cors";

import { initEventBus } from "./kernel/eventBus.js";
import { initAurin } from "./kernel/aurinRouter.js";
import { loadAgents } from "./kernel/loader.js";

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// =========================
// BOOT CORE
// =========================

const bus = initEventBus();
const agents = loadAgents(bus);
const aurin = initAurin(bus, agents);

// =========================
// HEALTH
// =========================

app.get("/health", (req, res) => {
  res.json({
    system: "OMNIVEX_OS_V1",
    status: "RUNNING",
    agents: Object.keys(agents),
    ts: Date.now()
  });
});

// =========================
// EVENT INPUT
// =========================

app.post("/event", (req, res) => {
  const event = req.body;

  if (!event || !event.type) {
    return res.status(400).json({
      ok: false,
      error: "missing event.type"
    });
  }

  bus.emit(event.type, {
    id: crypto.randomUUID(),
    type: event.type,
    payload: event.payload || {},
    ts: Date.now()
  });

  res.json({
    ok: true,
    emitted: event.type
  });
});

// =========================
// SIM LOOP (SAFE)
// =========================

setInterval(() => {
  bus.emit("market.tick", {
    id: crypto.randomUUID(),
    type: "market.tick",
    payload: {
      price: 1000 + Math.random() * 50,
      volume: Math.random() * 1000,
      source: "SIM"
    },
    ts: Date.now()
  });
}, 3000);

// =========================
// START
// =========================

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("OMNIVEX OS V1 RUNNING");
  console.log("PORT:", PORT);
});
