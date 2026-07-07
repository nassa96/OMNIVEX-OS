import { getLedger } from "../chronicle/chronicle.js";

/**
 * OMNIVEX FORGE — REPLAY ENGINE
 * Converts CHRONICLE history into learning dataset
 */

export function loadReplay(filter = {}) {
  const data = getLedger();

  if (!filter.type) return data;

  return data.filter(e => e.type === filter.type);
}

/**
 * Build structured training dataset from execution history
 */
export function buildDataset() {
  const data = getLedger();

  return data
    .filter(e => e.type.includes("POSITION") || e.type.includes("EXECUTION"))
    .map(e => ({
      symbol: e.symbol,
      action: e.action,
      confidence: e.confidence,
      pnl: e.metadata?.pnl || 0,
      risk: e.metadata?.riskFlags || [],
      ts: e.ts
    }));
}
