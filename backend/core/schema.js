/**
 * ATLAS EVENT SCHEMA (SINGLE SOURCE OF TRUTH)
 */

export function createEvent({
  symbol,
  price,
  prev,
  signal,
  risk,
  execution,
  momentum,
  strength
}) {
  return {
    ts: Date.now(),

    symbol,

    market: {
      price,
      prev
    },

    signal: {
      type: signal?.type || "SOPHIA_SIGNAL",
      action: signal?.signal || signal?.action || "HOLD",
      momentum: signal?.momentum ?? 0,
      strength: signal?.strength ?? "NEUTRAL"
    },

    risk: {
      type: risk?.type || "AEGIS_RISK",
      level: risk?.risk || "LOW",
      kill: risk?.kill ?? false
    },

    execution: {
      state: execution?.state || "IDLE",
      action: execution?.action || "NO_OP"
    }
  };
}
