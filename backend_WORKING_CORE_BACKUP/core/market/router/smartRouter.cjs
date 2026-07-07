/**
 * SAINT V30 — SMART EXECUTION ROUTER
 * ----------------------------------
 * Chooses best exchange based on:
 * - slippage risk
 * - liquidity depth
 * - execution quality score
 */

class SmartRouter {

  scoreVenue(venue, prediction, market) {

    const liquidity = market.liquidityScore || 0;
    const spread = market.spread || 0;

    const slippagePenalty = prediction.slippageRisk || 0;
    const qualityBoost = prediction.executionScore || 0;

    // Venue-specific weighting (you can tune later)
    const venueWeight =
      venue === "binance" ? 1.0 :
      venue === "coinbase" ? 0.9 :
      venue === "kraken" ? 0.85 : 0.7;

    const score =
      (liquidity * 0.4) +
      (qualityBoost * 0.3) -
      (slippagePenalty * 0.4) -
      (spread * 0.02) +
      venueWeight;

    return score;
  }

  select(venues, predictionMap, marketMap) {

    let bestVenue = null;
    let bestScore = -Infinity;

    for (const venue of Object.keys(venues)) {

      const prediction = predictionMap[venue];
      const market = marketMap[venue];

      if (!prediction || !market) continue;

      const score = this.scoreVenue(venue, prediction, market);

      if (score > bestScore) {
        bestScore = score;
        bestVenue = venue;
      }
    }

    return {
      selectedVenue: bestVenue,
      score: bestScore
    };
  }
}

module.exports = SmartRouter;
