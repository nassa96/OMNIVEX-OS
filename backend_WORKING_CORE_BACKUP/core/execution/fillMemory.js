/**
 * SAINT v9 Fill Memory Store
 * Tracks execution intent vs reality
 */

const fills = [];

/**
 * Record a trade execution result
 */
function recordFill(entry) {
  const fill = {
    id: `${Date.now()}-${Math.random()}`,
    timestamp: Date.now(),

    symbol: entry.symbol,
    side: entry.side,

    intendedPrice: entry.intendedPrice,
    filledPrice: entry.filledPrice,

    positionSize: entry.positionSize,

    slippage:
      (entry.filledPrice - entry.intendedPrice) /
      (entry.intendedPrice || 1),

    executionScore: entry.executionScore || 0,

    status: entry.status
  };

  fills.push(fill);

  // prevent unbounded memory growth
  if (fills.length > 5000) {
    fills.shift();
  }

  return fill;
}

/**
 * Get recent execution history
 */
function getFills(limit = 100) {
  return fills.slice(-limit);
}

/**
 * Compute system-wide execution quality
 */
function executionQuality() {
  if (fills.length === 0) return 0.5;

  const recent = fills.slice(-200);

  const avgSlippage =
    recent.reduce((sum, f) => sum + Math.abs(f.slippage), 0) /
    recent.length;

  const avgScore =
    recent.reduce((sum, f) => sum + (f.executionScore || 0), 0) /
    recent.length;

  return {
    avgSlippage,
    avgScore,
    efficiency: Math.max(0, 1 - avgSlippage)
  };
}

export {
  recordFill,
  getFills,
  executionQuality
};
