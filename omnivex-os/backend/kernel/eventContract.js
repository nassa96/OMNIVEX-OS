/**
 * OMNIVEX OS — EVENT CONTRACT (CANONICAL)
 * Every system MUST emit/consume this shape.
 */

export function normalizeEvent(type, payload = {}) {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    ts: Date.now(),

    type,

    source: payload.source || "unknown",

    data: payload.data || payload,

    meta: {
      severity: payload.severity || "info",
      route: payload.route || null
    }
  };
}

export function isValidEvent(event) {
  if (!event) return false;
  if (!event.type) return false;
  if (!event.ts) return false;
  return true;
}
