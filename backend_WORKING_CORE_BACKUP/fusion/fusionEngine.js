/**
 * ATLAS FUSION ENGINE V1
 * Converts multi-source market noise into a single truth model
 *
 * Inputs:
 * - Mercury (price stream)
 * - On-chain signals (Etherscan / Moralis / Covalent)
 * - Market aggregators (CoinGecko / Dexscreener)
 *
 * Output:
 * - unified probabilistic market state
 */

const STATE = {
  cache: {}
};

/* =========================
   MAIN FUSION FUNCTION
========================= */
export function fuseMarketState(symbol, mercury, onchain = {}, external = {}) {
  const price = mercury.price;
  const prev = mercury.prev;

  /* =========================
     CORE MICROSTRUCTURE SIGNALS
  ========================= */
  const returnRate = (price - prev) / prev;

  const volatility = Math.abs(returnRate);

  /* =========================
     ONCHAIN PRESSURE MODEL
     (wallet flow, tx spikes, liquidity shifts)
  ========================= */
  const onchainPressure =
    normalize(onchain.txVolume) * 0.4 +
    normalize(onchain.walletActivity) * 0.3 +
    normalize(onchain.exchangeInflow || 0) * 0.3;

  /* =========================
     MARKET SENTIMENT LAYER
     (Dexscreener / CoinGecko proxy signals)
  ========================= */
  const sentiment =
    normalize(external.volumeSpike) * 0.5 +
    normalize(external.trendingScore) * 0.5;

  /* =========================
     MEME / SPECULATION PRESSURE
  ========================= */
  const speculationPressure =
    volatility * 0.6 +
    sentiment * 0.4;

  /* =========================
     FINAL FUSED STATE
  ========================= */
  const fused = {
    symbol,

    price,
    prev,
    returnRate,

    volatility,

    onchainPressure,
    sentiment,
    speculationPressure,

    regime:
      speculationPressure > 0.25
        ? "HIGH_SPECULATION"
        : speculationPressure > 0.1
        ? "ACTIVE"
        : "STABLE"
  };

  STATE.cache[symbol] = fused;

  return fused;
}

/* =========================
   NORMALIZATION HELPER
========================= */
function normalize(value) {
  if (!value) return 0;
  if (typeof value !== "number") return 0;
  return Math.min(Math.max(value, 0), 1);
}

/* =========================
   ACCESSOR
========================= */
export function getFusionState(symbol) {
  return STATE.cache[symbol];
}
