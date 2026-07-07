import { emitEvent } from "../chronicle/eventAdapter.js";

let lastKey = null;

export function normalize(event = {}) {
  return {
    ts: Date.now(),
    type: event.type || "EXECUTION",
    symbol: event.symbol || "UNKNOWN",
    action: event.action || "HOLD",
    confidence: event.confidence ?? 0,
    riskFlags: event.riskFlags || [],
    metadata: event.metadata || {}
  };
}

function isDuplicate(e) {
  const key = `${e.symbol}:${e.action}:${e.confidence}`;
  if (key === lastKey) return true;
  lastKey = key;
  return false;
}

function checkRisk(e, context = {}) {
  const aegis = context.aegis || {};
  const policy = context.policy || {};

  if (aegis.block) return { ok: false, reason: "AEGIS_BLOCK" };
  if (policy.blocks?.length) return { ok: false, reason: policy.blocks };

  return { ok: true };
}

/**
 * EXECUTION GATE (NOW CHRONICLE-BOUND)
 */
export function executionGate(event, context = {}) {
  const e = normalize(event);

  const risk = checkRisk(e, context);

  // ❌ BLOCK PATH → STILL RECORDED
  if (!risk.ok) {
    const blocked = {
      allowed: false,
      reason: risk.reason,
      event: e
    };

    emitEvent({
      type: "RISK_BLOCK",
      source: "EXECUTION_GATE",
      symbol: e.symbol,
      action: e.action,
      confidence: e.confidence,
      metadata: blocked
    });

    return blocked;
  }

  // ❌ DUPLICATE PATH → STILL RECORDED
  if (isDuplicate(e)) {
    const dup = {
      allowed: false,
      reason: "DUPLICATE_BLOCK",
      event: e
    };

    emitEvent({
      type: "DUPLICATE_BLOCK",
      source: "EXECUTION_GATE",
      symbol: e.symbol,
      action: e.action,
      confidence: e.confidence,
      metadata: dup
    });

    return dup;
  }

  // ✅ ALLOWED PATH → RECORD & PASS THROUGH
  const allowedEvent = {
    allowed: true,
    event: e
  };

  emitEvent({
    type: "EXECUTION_GATE_PASS",
    source: "EXECUTION_GATE",
    symbol: e.symbol,
    action: e.action,
    confidence: e.confidence,
    metadata: allowedEvent
  });

  return allowedEvent;
}
