// ======================================================
// FILE: backend/core/orchestrator.js
// OMNIVEX ORCHESTRATOR (SYSTEM GOVERNOR)
// ======================================================

import { eventBus } from "./eventBus.js";
import { runSophia } from "../agents/sophia/index.js";
import { evaluateRisk } from "../engines/aegis.js";

// ------------------------------
// REGISTER PIPELINE
// ------------------------------
export function initOrchestrator() {

  eventBus.on("MARKET_TICK", (market) => {

    const signal = runSophia(market);
    const risk = evaluateRisk(market);

    eventBus.emit("SIGNAL", signal);
    eventBus.emit("RISK", risk);

    const decision = decide(signal, risk);

    eventBus.emit("DECISION", {
      ...decision,
      market
    });
  });
}

// ------------------------------
// DECISION ENGINE
// ------------------------------
function decide(signal, risk) {
  if (risk.risk === "HIGH") {
    return { action: "BLOCK" };
  }

  if (signal.signal === "BUY") {
    return { action: "BUY" };
  }

  if (signal.signal === "SELL") {
    return { action: "SELL" };
  }

  return { action: "HOLD" };
}
