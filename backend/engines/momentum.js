/**
 * MOMENTUM ENGINE V1 (FIXED CONTRACT)
 */

export function computeMomentum(prev, current) {
  if (!prev || !current) return 0;

  const delta = current - prev;
  const pct = delta / prev;

  const scaled = pct * 10;

  return Math.max(-1, Math.min(1, scaled));
}

/**
 * MUST MATCH SERVER IMPORT EXACTLY
 */
export function classifyMomentum(m) {
  if (m >= 0.6) return "STRONG_BUY";
  if (m >= 0.2) return "BUY";
  if (m <= -0.6) return "STRONG_SELL";
  if (m <= -0.2) return "SELL";
  return "NEUTRAL";
}
