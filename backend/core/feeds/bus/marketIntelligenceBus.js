"use strict";

/**
 * ==========================================
 * MARKET INTELLIGENCE ORCHESTRATOR v2
 * INSTITUTIONAL MARKET DATA CONTROL PLANE
 * ==========================================
 *
 * ROLE:
 * - ingest raw market data
 * - delegate enrichment (order book, microstructure)
 * - maintain asset state
 * - build deterministic snapshots
 * - route normalized intelligence to kernel
 *
 * RULE:
 * NO execution logic inside bus
 */

import orderbook from "../../market/orderbook/orderBookEngine.js";

/**
 * ==========================
 * STATE STORE (ROLLING MEMORY)
 * ==========================
 */
const STATE = {
  assets: new Map(),
  regime: "UNKNOWN"
};

/**
 * ==========================
 * TICK NORMALIZATION (PURE)
 * ==========================
 */
function normalizeTick(raw) {
  const symbol = raw.symbol || "UNKNOWN";

  return {
    symbol,
    price: Number(raw.price || 0),
    volume: Number(raw.volume || 0),
    change: Number(raw.change || 0),
    volatility: Number(raw.volatility || 0.5),
    spread: Number(raw.spread || 0.01),

    ts: Date.now()
  };
}

/**
 * ==========================
 * ENRICHMENT LAYER (DELEGATED)
 * ==========================
 */
function enrich(symbol, rawTick) {
  return {
    imbalance: orderbook.getImbalance(symbol),
    spread: orderbook.getSpread(symbol),
    depth: orderbook.getDepthStrength?.(symbol) || 0,
    score: orderbook.microstructureScore(symbol)
  };
}

/**
 * ==========================
 * INGESTION PIPELINE
 * ==========================
 */
export function ingest(rawTick) {
  const tick = normalizeTick(rawTick);
  const symbol = tick.symbol;

  if (!STATE.assets.has(symbol)) {
    STATE.assets.set(symbol, []);
  }

  const history = STATE.assets.get(symbol);

  // keep rolling window
  history.push(tick);
  if (history.length > 50) history.shift();

  // ==========================
  // ORDER BOOK UPDATE (SIDE EFFECT ONLY)
  // ==========================
  if (rawTick?.bids && rawTick?.asks) {
    orderbook.updateBook(symbol, rawTick);
  }

  return tick;
}

/**
 * ==========================
 * SNAPSHOT BUILDER (PURE OUTPUT)
 * ==========================
 */
export function buildSnapshot() {
  const assets = [];

  for (const [symbol, history] of STATE.assets.entries()) {
    const latest = history[history.length - 1];
    if (!latest) continue;

    const enriched = enrich(symbol, latest);

    assets.push({
      symbol,
      latest: {
        ...latest,
        micro: enriched
      },
      history
    });
  }

  return {
    regime: STATE.regime,
    assets
  };
}

/**
 * ==========================
 * ROUTER (NO EXECUTION HERE)
 * ==========================
 */
export function route(snapshot, kernelHandler) {
  for (const asset of snapshot.assets) {
    kernelHandler(asset.latest, {
      regime: snapshot.regime,
      history: asset.history
    });
  }
}

/**
 * ==========================
 * REGIME PLACEHOLDER (HOOK)
 * ==========================
 */
export function setRegime(regime) {
  STATE.regime = regime;
}

export function getState() {
  return {
    regime: STATE.regime,
    assetCount: STATE.assets.size
  };
}

export default {
  ingest,
  buildSnapshot,
  route,
  setRegime,
  getState
};
