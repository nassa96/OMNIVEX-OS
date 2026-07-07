/**
 * SAINT V2 — LIQUIDITY NORMALIZATION ENGINE
 * -----------------------------------------
 * Converts all sources → unified market surface
 */

class LiquidityNormalizer {

  // ---------------------------
  // STANDARD FORMAT
  // ---------------------------
  normalize() {
    return {
      bids: [],
      asks: [],
      liquidityScore: 0,
      source: null,
      venue: null,
      ts: Date.now()
    };
  }

  // ---------------------------
  // BINANCE NORMALIZATION
  // ---------------------------
  fromBinance(data) {

    const bids = (data.bids || []).map(b => ({
      price: parseFloat(b[0]),
      size: parseFloat(b[1])
    }));

    const asks = (data.asks || []).map(a => ({
      price: parseFloat(a[0]),
      size: parseFloat(a[1])
    }));

    return {
      venue: "binance",
      source: "cex",
      bids,
      asks,
      liquidityScore: this.scoreOrderbook(bids, asks),
      ts: Date.now()
    };
  }

  // ---------------------------
  // COINBASE NORMALIZATION
  // ---------------------------
  fromCoinbase(data) {

    const changes = data.changes || [];

    const bids = [];
    const asks = [];

    for (const c of changes) {
      const side = c[0];
      const price = parseFloat(c[1]);
      const size = parseFloat(c[2]);

      if (side === "buy") {
        bids.push({ price, size });
      } else {
        asks.push({ price, size });
      }
    }

    return {
      venue: "coinbase",
      source: "cex",
      bids,
      asks,
      liquidityScore: this.scoreOrderbook(bids, asks),
      ts: Date.now()
    };
  }

  // ---------------------------
  // DEX / POOL NORMALIZATION
  // ---------------------------
  fromDexPool(data) {

    return {
      venue: data.dex || "uniswap",
      source: "dex",
      bids: [{
        price: data.price || 0,
        size: data.liquidityUSD || 0
      }],
      asks: [{
        price: data.price || 0,
        size: data.liquidityUSD || 0
      }],
      liquidityScore: this.scorePool(data),
      ts: Date.now()
    };
  }

  // ---------------------------
  // ONCHAIN NORMALIZATION
  // ---------------------------
  fromChain(data) {

    return {
      venue: data.chain,
      source: "onchain",
      bids: [],
      asks: [],
      liquidityScore: data.liquidity?.liquidityUSD
        ? Math.log10(data.liquidity.liquidityUSD + 1)
        : 0,
      ts: Date.now()
    };
  }

  // ---------------------------
  // ORDERBOOK SCORING
  // ---------------------------
  scoreOrderbook(bids, asks) {

    const bidDepth = bids.reduce((a,b)=>a + b.size, 0);
    const askDepth = asks.reduce((a,b)=>a + b.size, 0);

    const imbalance = Math.abs(bidDepth - askDepth);

    return Math.log10((bidDepth + askDepth + 1) / (imbalance + 1));
  }

  // ---------------------------
  // POOL SCORING
  // ---------------------------
  scorePool(pool) {

    const liq = pool.liquidityUSD || 0;

    return Math.log10(liq + 1);
  }
}

module.exports = LiquidityNormalizer;
