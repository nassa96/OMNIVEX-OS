const processed = new Set();

/* =========================
   IDEMPOTENCY GUARD
========================= */
export function isProcessed(orderId) {
  return processed.has(orderId);
}

export function markProcessed(orderId) {
  processed.add(orderId);
}
