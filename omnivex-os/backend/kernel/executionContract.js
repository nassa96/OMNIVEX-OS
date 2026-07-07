/**
 * OMNIVEX OS — EXECUTION CONTRACT
 * Defines all enforceable trade actions
 */

export function createExecutionOrder({
  asset,
  side = "BUY",
  size = 0,
  confidence = 0,
  source = "SAINT"
}) {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    ts: Date.now(),

    type: "EXECUTION_ORDER",

    asset,
    side, // BUY | SELL

    size, // normalized allocation 0–1
    confidence, // conviction score

    source,

    status: "PENDING"
  };
}
