/**
 * SIMPLE LEDGER LAYER (STABLE CORE MEMORY CONTRACT)
 * Replaces missing persistence dependency for simulator
 */

const ledger = {
  entries: []
};

export function get() {
  return ledger.entries;
}

export function add(entry) {
  ledger.entries.push({
    ...entry,
    ts: Date.now()
  });

  return ledger.entries.length;
}

export function clear() {
  ledger.entries = [];
}

export default {
  get,
  add,
  clear
};
