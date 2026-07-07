/**
 * CERBERUS → CONDUCTOR ADAPTER
 *
 * Normalizes intelligence signals into allocation-ready format
 */

const cerberus = require("../index");

async function getAllocationSignals() {
  const signals = await cerberus.getCerberusSignals();

  return signals.map(s => ({
    symbol: s.asset,
    score: s.intelligenceScore,
    conviction: s.conviction,
    liquidity: s.liquidityUSD,
    momentum: s.priceChange24h,

    // translated into capital intent
    riskTier:
      s.intelligenceScore > 85 ? "AGGRESSIVE" :
      s.intelligenceScore > 70 ? "MODERATE" : "DEFENSIVE",

    suggestedAllocation:
      s.intelligenceScore > 85 ? 0.15 :
      s.intelligenceScore > 70 ? 0.08 : 0.03
  }));
}

module.exports = {
  getAllocationSignals
};
