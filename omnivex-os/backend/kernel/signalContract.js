/**
 * OMNIVEX OS — SIGNAL CONTRACT
 * Standardizes all alpha / meme / market signals
 */

export function createSignal({
  type,
  strength = 0,
  asset = "UNKNOWN",
  source = "SOPHIA",
  metadata = {}
}) {
  return {
    id: crypto.randomUUID?.() || String(Date.now()),
    ts: Date.now(),

    type, // MEME | MARKET | EXECUTION | RISK
    asset,

    strength, // 0 → 1 normalized conviction

    source,

    metadata
  };
}
