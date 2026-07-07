/**
 * CERBERUS — DEXSCREENER CONNECTOR
 * Pulls live token pairs for early discovery
 */

const BASE_URL = "https://api.dexscreener.com/latest/dex";

async function fetchTrendingPairs() {
  try {
    const res = await fetch(`${BASE_URL}/trending-pairs`);
    const data = await res.json();

    return data?.pairs || [];
  } catch (err) {
    console.error("[CERBERUS] Dexscreener error:", err.message);
    return [];
  }
}

async function fetchTokenPairsByChain(chain = "solana") {
  try {
    const res = await fetch(`${BASE_URL}/pairs/${chain}`);
    const data = await res.json();

    return data?.pairs || [];
  } catch (err) {
    console.error("[CERBERUS] Chain fetch error:", err.message);
    return [];
  }
}

module.exports = {
  fetchTrendingPairs,
  fetchTokenPairsByChain
};
