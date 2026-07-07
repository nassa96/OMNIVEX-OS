/**
 * SAINT V34 — SMART EXECUTION ROUTER
 * ----------------------------------
 * Routes orders across exchanges using fused liquidity (V33)
 */

class SmartExecutionRouterV34 {

  constructor(liquidityEngine, exchangeEngine) {

    this.liquidity = liquidityEngine;
    this.exchanges = exchangeEngine;
  }

  // =====================================================
  // SELECT BEST EXECUTION VENUES
  // =====================================================
  selectVenues(context) {

    const venues = this.exchanges.snapshot();

    const ranked = [];

    for (const ex in venues) {

      const score =
        this.exchanges.engine.score(ex, context);

      ranked.push({ ex, score });
    }

    return ranked
      .sort((a, b) => b.score - a.score)
      .map(v => v.ex);
  }

  // =====================================================
  // SPLIT ORDER BASED ON LIQUIDITY
  // =====================================================
  splitOrder(symbol, size) {

    const book = this.liquidity.snapshot();

    const imbalance = book.imbalance;

    const heatmap = book.heatmap;

    const splits = [];

    let remaining = size;

    // prioritize high-liquidity zones first
    const sorted = heatmap
      .filter(z => z.strength > 0)
      .sort((a, b) => b.strength - a.strength);

    for (const zone of sorted) {

      if (remaining <= 0) break;

      const portion = Math.min(
        remaining,
        zone.strength * 0.01
      );

      splits.push({
        priceHint: zone.price,
        size: portion,
        type: zone.type
      });

      remaining -= portion;
    }

    // leftover goes to market fallback
    if (remaining > 0) {
      splits.push({
        priceHint: "MARKET",
        size: remaining,
        type: "FALLBACK"
      });
    }

    return splits;
  }

  // =====================================================
  // EXECUTION ROUTE GENERATION
  // =====================================================
  route(order, context) {

    const venues = this.selectVenues(context);

    const splits = this.splitOrder(order.symbol, order.size);

    const routes = [];

    // distribute splits across best venues
    for (let i = 0; i < splits.length; i++) {

      const venue = venues[i % venues.length];

      routes.push({
        venue,
        ...splits[i]
      });
    }

    return routes;
  }

  // =====================================================
  // EXECUTE ROUTE
  // =====================================================
  execute(order, context) {

    const routes = this.route(order, context);

    const results = [];

    for (const r of routes) {

      if (!this.exchanges.canTrade(r.venue, r.size)) {
        continue;
      }

      this.exchanges.order(r.venue, {
        symbol: order.symbol,
        size: r.size,
        priceHint: r.priceHint,
        type: order.type || "MARKET"
      });

      results.push(r);
    }

    return {
      executed: results.length,
      routes,
      timestamp: Date.now()
    };
  }
}

module.exports = SmartExecutionRouterV34;
