import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

/* CORE */
import {
  fetchLivePrice,
  getPriceSeries,
  getLastPrice,
  get24hChange,
  getVolatility,
  commitPrice
} from "./core/market.js";

import { decisionKernel } from "./core/strategy.js";

import {
  insertSignal,
  insertTrade
} from "./services/supabase.js";

/* PATH RESOLUTION (CRITICAL FOR TERMUX + ES MODULES) */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* APP */
const app = express();
app.use(cors());
app.use(express.json());

/* STATIC FRONTEND SERVE */
app.use(express.static(path.join(__dirname, "public")));

/* HTTP SERVER */
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

/* STATE */
const state = {
  trades: 0,
  blocked: 0,
  pnl: 0,
  price: 0,
  volatility: "LOW"
};

/* HEALTH CHECK */
app.get("/health", (req, res) => {
  res.json({ status: "ok", system: "SAINT OMNIVEX" });
});

/* STATE API */
app.get("/state", (req, res) => {
  res.json({
    ...state,
    price: getLastPrice(),
    change24h: get24hChange(),
    volatility: getVolatility()
  });
});

/* WEBSOCKET */
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

/* KERNEL LOOP */
async function tick() {
  const { price } = await fetchLivePrice();

  state.price = price;
  state.volatility = getVolatility();

  const decision = decisionKernel({
    price,
    volatility: state.volatility
  });

  await insertSignal({
    signal: decision.action,
    confidence: decision.confidence,
    price,
    volatility: state.volatility,
    reason: decision.reason || "kernel"
  });

  if (decision.allow) {
    state.trades++;

    const pnl = decision.simulatedPnL || 0;
    state.pnl += pnl;

    await insertTrade({
      signal: decision.action,
      confidence: decision.confidence,
      price,
      pnl,
      trade_number: state.trades
    });

    broadcast({
      type: "TRADE",
      ...decision,
      price,
      pnl
    });
  } else {
    state.blocked++;

    broadcast({
      type: "BLOCK",
      ...decision,
      price
    });
  }
}

setInterval(tick, 8000);

/* START SERVER */
server.listen(3000, () => {
  console.log("[SAINT] ONLINE http://localhost:3000");
});
