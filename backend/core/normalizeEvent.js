export function normalizeEvent(e = {}) {
  return {
    ts: e.ts || Date.now(),

    symbol: e.symbol || "UNKNOWN",

    price: num(e.price),

    prev: num(e.prev),

    signal: {
      value: e.signal?.signal || e.signal || "HOLD"
    },

    risk: {
      level: e.risk?.risk || e.risk || "LOW"
    },

    momentum: num(e.momentum),

    strength: computeStrength(e),

    regime: e.regime?.regime || e.regime || "UNKNOWN",

    strategy: e.strategy?.type || e.strategy || "NONE",

    execution: {
      state: e.execution?.state || "IDLE",
      action: e.execution?.action || e.execution?.decision || "NO_OP"
    },

    riskState: e.riskState || null
  };
}

/* ========================= */

function num(v) {
  if (typeof v !== "number") return 0;
  if (Number.isNaN(v)) return 0;
  return v;
}

function computeStrength(e) {
  const m = Math.abs(e.momentum || 0);

  if (m > 0.01) return "STRONG";
  if (m > 0.003) return "MODERATE";
  return "NEUTRAL";
}
