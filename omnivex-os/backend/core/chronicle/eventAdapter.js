import { record } from "./chronicle.js";

/**
 * STANDARD EVENT ENVELOPE WRAPPER
 * Ensures all subsystems emit into CHRONICLE
 */

export function emitEvent(event = {}) {
  const normalized = {
    type: event.type || "UNKNOWN",
    source: event.source || "SYSTEM",
    symbol: event.symbol || null,
    action: event.action || null,
    confidence: event.confidence ?? 0,
    riskFlags: event.riskFlags || [],
    metadata: event.metadata || {},
    raw: event.raw || null
  };

  return record(normalized);
}
