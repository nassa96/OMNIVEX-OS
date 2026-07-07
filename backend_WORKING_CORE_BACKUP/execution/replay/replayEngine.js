import { getLedger } from "../ledger/executionLedger.js";

/**
 * REPLAY ENGINE V1
 * Reconstructs execution history deterministically
 */

export function replayExecution(filter = {}) {
  const ledger = getLedger();

  const filtered = ledger.filter((e) => {
    if (filter.symbol && e.symbol !== filter.symbol) return false;
    if (filter.state && e.state !== filter.state) return false;
    return true;
  });

  const replay = [];

  for (const event of filtered) {
    replay.push({
      symbol: event.symbol,
      state: event.state,
      signal: event.signal,
      risk: event.risk,
      execution: event.execution,
      timestamp: event.timestamp
    });
  }

  return {
    count: replay.length,
    events: replay
  };
}
