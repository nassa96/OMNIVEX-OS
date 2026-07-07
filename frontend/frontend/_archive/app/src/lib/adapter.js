export function normalizeKernel(payload) {
  if (!payload) return null;

  return {
    system: payload.system || "OMNIVEX",
    market: {
      symbol: payload.tick?.symbol,
      price: payload.tick?.price,
    },

    execution: {
      lastSignal: payload.sophia?.signal || "HOLD",
      strength: payload.sophia?.strength || 0,
      reason: payload.sophia?.reason || "N/A"
    },

    memory: {
      ticks: payload.ticks || 0,
      braintrust: payload.braintrust || []
    }
  };
}
