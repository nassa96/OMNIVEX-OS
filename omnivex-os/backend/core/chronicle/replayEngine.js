/**
 * CHRONICLE REPLAY ENGINE v1
 * --------------------------
 * Deterministic event log for full system replay
 */

const ledger = [];

/**
 * Store every system event (truth capture layer)
 */
export function recordEvent(event) {
  const entry = {
    ts: Date.now(),
    ...event
  };

  ledger.push(entry);

  // keep bounded memory (in-memory MVP)
  if (ledger.length > 5000) {
    ledger.shift();
  }

  return entry;
}

/**
 * Retrieve full history
 */
export function getLedger() {
  return ledger;
}

/**
 * Filtered replay by symbol or type
 */
export function replay(filter = {}) {
  const { symbol, type } = filter;

  return ledger.filter((e) => {
    if (symbol && e.symbol !== symbol) return false;
    if (type && e.type !== type) return false;
    return true;
  });
}

/**
 * Deterministic reconstruction snapshot
 */
export function rebuildState(symbol) {
  const events = ledger.filter((e) => e.symbol === symbol);

  let position = {
    size: 0,
    avgPrice: 0
  };

  for (const e of events) {
    if (e.action === "BUY") {
      position = {
        size: e.size,
        avgPrice: e.price
      };
    }

    if (e.action === "SELL") {
      position = {
        size: 0,
        avgPrice: 0
      };
    }
  }

  return {
    symbol,
    finalState: position,
    eventsCount: events.length
  };
}
