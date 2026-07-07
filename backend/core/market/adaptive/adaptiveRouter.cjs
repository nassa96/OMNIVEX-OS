/**
 * SAINT V35 — SELF-TUNING ROUTER
 * --------------------------------
 * Adjusts venue preference using:
 * - execution success rate
 * - slippage history
 * - prediction accuracy feedback
 */

class AdaptiveRouter {

  constructor(memory) {
    this.memory = memory;

    this.weights = {
      binance: 1.0,
      coinbase: 1.0,
      kraken: 1.0
    };
  }

  updateWeights() {

    const binance = this.memory.getVenueStats("binance");
    const coinbase = this.memory.getVenueStats("coinbase");
    const kraken = this.memory.getVenueStats("kraken");

    const normalize = (score) => Math.max(0.1, Math.min(2.0, score));

    this.weights.binance = normalize(binance.score);
    this.weights.coinbase = normalize(coinbase.score);
    this.weights.kraken = normalize(kraken.score);
  }

  scoreVenue(venue, prediction, market) {

    const baseWeight = this.weights[venue] || 1.0;

    const slippagePenalty = prediction.slippageRisk || 0;
    const executionBoost = prediction.executionScore || 0;

    const liquidity = market.liquidity || 0;
    const spread = market.spread || 0;

    return (
      baseWeight * 1.5 +
      executionBoost * 0.5 +
      liquidity * 0.3 -
      slippagePenalty * 0.6 -
      spread * 0.01
    );
  }

  select(venues, predictionMap, marketMap) {

    this.updateWeights();

    let bestVenue = null;
    let bestScore = -Infinity;

    for (const v of Object.keys(venues)) {

      const score = this.scoreVenue(
        v,
        predictionMap[v],
        marketMap[v]
      );

      if (score > bestScore) {
        bestScore = score;
        bestVenue = v;
      }
    }

    return {
      selectedVenue: bestVenue,
      score: bestScore,
      weights: this.weights
    };
  }
}

module.exports = AdaptiveRouter;
