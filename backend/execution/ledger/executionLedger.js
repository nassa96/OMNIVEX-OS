/**
 * EXECUTION LEDGER
 * Immutable in-memory execution history
 */

const LEDGER = [];

export function appendLedger(entry) {
  LEDGER.push({
    ...entry,
    timestamp: Date.now()
  });
}

export function getLedger() {
  return LEDGER;
}

export function clearLedger() {
  LEDGER.length = 0;
}
