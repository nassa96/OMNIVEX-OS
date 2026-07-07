/**
 * CERBERUS INTELLIGENCE — FINAL SCORING LAYER
 *
 * Combines:
 * - Wallet Flow
 * - Narrative Velocity
 * - Market Momentum (from base Cerberus)
 */

function computeIntelligenceScore({ wallet, narrative, base }) {
  const walletWeight = wallet.flowScore * 0.4;
  const narrativeWeight = narrative.velocityScore * 0.4;
  const baseWeight = (base.score || 50) / 100 * 0.2;

  const score =
    (walletWeight + narrativeWeight + baseWeight) * 100;

  return {
    intelligenceScore: Math.round(score),
    conviction:
      score > 80 ? "HIGH" :
      score > 60 ? "MEDIUM" : "LOW",
    signals: {
      whale: wallet.whaleAccumulation,
      narrative: narrative.isViral,
      momentum: base.priceChange24h > 0
    }
  };
}

module.exports = { computeIntelligenceScore };
