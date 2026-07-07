/**
 * SAINT V12 — SMART ORDER ROUTER
 * ------------------------------
 * Selects optimal exchange for execution based on execution quality model
 */

class SmartOrderRouter {

  constructor() {}

  // ---------------------------
  // MAIN ROUTING FUNCTION
  // ---------------------------
  route(signal, venues) {

    const scored = [];

    for (const v of venues) {

      const score = this.scoreVenue(signal, v);

      scored.push({
        venue: v.name,
        score,
        breakdown: v
      });
    }

    scored.sort((a, b) => b.score - a.score);

    return {
      best: scored[0],
      ranking: scored
    };
  }

  // ---------------------------
  // VENUE SCORING MODEL
  // ---------------------------
  scoreVenue(signal, v) {

    // liquidity strength
    const liquidityScore =
      Math.min(1, v.liquidity / 100000);

    // spread cost penalty
    const spreadPenalty =
      Math.min(1, v.spread / (v.mid + 1));

    // latency penalty (from V9)
    const latencyPenalty =
      Math.min(1, v.latency / 2000);

    // slippage risk (from V10)
    const slippagePenalty =
      v.estimatedSlippage || 0.2;

    // fill probability bonus
    const fillBonus =
      v.fillProbability || 0.5;

    // flow alignment bonus (V6/V8)
    const flowBonus =
      signal.signal === "LONG" && v.bias > 0 ? 0.2 :
      signal.signal === "SHORT" && v.bias < 0 ? 0.2 : 0;

    // ---------------------------
    // FINAL SCORE
    // ---------------------------
    let score =
      (liquidityScore * 0.3) +
      (fillBonus * 0.25) +
      (flowBonus * 0.2) -
      (spreadPenalty * 0.15) -
      (latencyPenalty * 0.1) -
      (slippagePenalty * 0.2);

    return Math.max(0, Math.min(1, score));
  }
}

module.exports = SmartOrderRouter;
