/**
 * EXECUTION GATE V2
 *
 * Protects SAINT from bad fills, slippage, illiquidity, and volatility traps.
 */

const exchange = require("../exchange/client"); // CCXT wrapper (or your existing adapter)

class ExecutionGateV2 {
  constructor() {
    this.limits = {
      maxSlippagePct: 0.003,     // 0.3%
      maxSpreadPct: 0.01,        // 1%
      minLiquidityUSD: 50000,     // minimum order book depth
      volatilityCutoff: 0.8,      // extreme market regime
      maxChunkSizeUSD: 2500      // split large orders
    };
  }

  async fetchMarket(symbol) {
    const ticker = await exchange.getTicker(symbol);

    // optional: if your exchange supports orderbook
    let orderBook = null;
    try {
      orderBook = await exchange.exchange.fetchOrderBook(symbol);
    } catch (e) {}

    return { ticker, orderBook };
  }

  calculateSpread(orderBook) {
    if (!orderBook || !orderBook.bids.length || !orderBook.asks.length) {
      return null;
    }

    const bid = orderBook.bids[0][0];
    const ask = orderBook.asks[0][0];

    return (ask - bid) / ((ask + bid) / 2);
  }

  estimateSlippage(orderBook, sizeUSD) {
    if (!orderBook) return 0.01;

    let remaining = sizeUSD;
    let cost = 0;

    const levels = orderBook.asks;

    for (const [price, qty] of levels) {
      const levelValue = price * qty;

      if (remaining <= levelValue) {
        cost += remaining * price;
        remaining = 0;
        break;
      } else {
        cost += levelValue;
        remaining -= levelValue;
      }
    }

    if (remaining > 0) {
      return 1; // infinite slippage (not enough liquidity)
    }

    const avgPrice = cost / sizeUSD;
    const bestAsk = orderBook.asks[0][0];

    return Math.abs(avgPrice - bestAsk) / bestAsk;
  }

  async validateOrder({ symbol, side, sizeUSD, volatility }) {
    const { ticker, orderBook } = await this.fetchMarket(symbol);

    const price = ticker.last;

    // 1. liquidity check
    let bookLiquidity = 0;
    if (orderBook) {
      for (const [p, q] of orderBook.asks) {
        bookLiquidity += p * q;
        if (bookLiquidity > this.limits.minLiquidityUSD) break;
      }
    }

    if (bookLiquidity < this.limits.minLiquidityUSD) {
      return {
        approved: false,
        reason: "LOW_LIQUIDITY"
      };
    }

    // 2. spread check
    const spread = this.calculateSpread(orderBook);
    if (spread && spread > this.limits.maxSpreadPct) {
      return {
        approved: false,
        reason: "WIDE_SPREAD"
      };
    }

    // 3. slippage simulation
    const slippage = this.estimateSlippage(orderBook, sizeUSD);

    if (slippage > this.limits.maxSlippagePct) {
      return {
        approved: false,
        reason: "SLIPPAGE_TOO_HIGH",
        slippage
      };
    }

    // 4. volatility kill switch
    if (volatility && volatility > this.limits.volatilityCutoff) {
      return {
        approved: false,
        reason: "HIGH_VOLATILITY"
      };
    }

    // 5. chunking strategy
    const chunks = [];

    let remaining = sizeUSD;

    while (remaining > 0) {
      const chunk = Math.min(remaining, this.limits.maxChunkSizeUSD);

      chunks.push({
        symbol,
        side,
        sizeUSD: chunk,
        estimatedSlippage: slippage
      });

      remaining -= chunk;
    }

    return {
      approved: true,
      chunks,
      price,
      spread,
      slippage
    };
  }

  async executeSafeOrder(order, saintExecutor) {
    const validation = await this.validateOrder(order);

    if (!validation.approved) {
      console.log("[EXECUTION BLOCKED]", validation.reason);
      return validation;
    }

    const results = [];

    for (const chunk of validation.chunks) {
      try {
        const res = await saintExecutor.execute(chunk);
        results.push(res);
      } catch (e) {
        results.push({ error: e.message });
      }
    }

    return {
      executed: true,
      results
    };
  }
}

module.exports = new ExecutionGateV2();
