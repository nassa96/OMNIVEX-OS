"use strict";

/**
 * ==========================================
 * SAINT_PRIMAL TELEMETRY HUB v1
 * OBSERVABILITY + SYSTEM INTROSPECTION LAYER
 * ==========================================
 *
 * ROLE:
 * - capture runtime kernel state
 * - stream system metrics
 * - expose observability feed for dashboard
 */

import chronicle from "../chronicle/ledger.js";
import risk from "../risk/killswitch/riskKillSwitch.js";

const STATE = {
  ticks: 0,
  lastDecision: null,
  lastExecution: null,
  pnl: 0,
  regime: "UNKNOWN"
};

const subscribers = new Set();

/**
 * ==========================
 * SUBSCRIBE DASHBOARD CLIENTS
 * ==========================
 */
export function subscribe(ws) {
  subscribers.add(ws);

  ws.on("close", () => {
    subscribers.delete(ws);
  });
}

/**
 * ==========================
 * EMIT TELEMETRY SNAPSHOT
 * ==========================
 */
export function emit(event) {
  const snapshot = buildSnapshot(event);

  for (const ws of subscribers) {
    try {
      ws.send(JSON.stringify(snapshot));
    } catch (_) {}
  }

  return snapshot;
}

/**
 * ==========================
 * BUILD SYSTEM SNAPSHOT
 * ==========================
 */
function buildSnapshot(event) {
  const regime = chronicle.getRegime?.() || "UNKNOWN";
  const riskState = risk.getRiskState?.() || {};

  STATE.ticks++;

  if (event?.decision) STATE.lastDecision = event.decision;
  if (event?.execution) STATE.lastExecution = event.execution;

  STATE.regime = regime;
  STATE.pnl += event?.execution?.pnl || 0;

  return {
    type: "TELEMETRY",
    ts: Date.now(),

    system: {
      ticks: STATE.ticks,
      regime: STATE.regime,
      pnl: STATE.pnl
    },

    risk: {
      circuitBroken: riskState.circuitBroken,
      enabled: riskState.enabled
    },

    last: {
      decision: STATE.lastDecision,
      execution: STATE.lastExecution
    }
  };
}

/**
 * ==========================
 * PUBLIC STATE ACCESS
 * ==========================
 */
export function getTelemetry() {
  return STATE;
}

export default {
  subscribe,
  emit,
  getTelemetry
};
