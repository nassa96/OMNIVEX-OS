/**
 * SAINT V13 — MULTI-EXCHANGE EXECUTION ENGINE
 * -------------------------------------------
 * Splits and executes orders across multiple venues
 */

class MultiExchangeExecutor {

  constructor(router) {
    this.router = router;
  }

  // ---------------------------
  // MAIN EXECUTION ENTRY
  // ---------------------------
  execute(signal, venues, totalQty = 1) {

    const routing = this.router.route(signal, venues);

    const allocation = this.allocate(routing.ranking, totalQty);

    const results = [];

    for (const order of allocation) {

      const fill = this.executeOnVenue(order);

      results.push(fill);
    }

    return {
      signal: signal.signal,
      allocation,
      results,
      summary: this.summarize(results)
    };
  }

  // ---------------------------
  // ORDER SPLITTING LOGIC
  // ---------------------------
  allocate(rankedVenues, totalQty) {

    const totalScore = rankedVenues.reduce((a, v) => a + v.score, 0) || 1;

    return rankedVenues.map(v => {

      const weight = v.score / totalScore;

      return {
        venue: v.venue,
        qty: totalQty * weight
      };
    });
  }

  // ---------------------------
  // EXECUTION SIMULATION LAYER
  // (replace later with real REST/WebSocket execution)
  // ---------------------------
  executeOnVenue(order) {

    const slippage = Math.random() * 0.002;
    const fillPriceImpact = 1 + slippage;

    return {
      venue: order.venue,
      qty: order.qty,
      fillPriceImpact,
      filled: true,
      ts: Date.now()
    };
  }

  // ---------------------------
  // RESULT AGGREGATION
  // ---------------------------
  summarize(results) {

    let totalQty = 0;
    let weightedPrice = 0;

    for (const r of results) {
      totalQty += r.qty;
      weightedPrice += r.qty * r.fillPriceImpact;
    }

    return {
      avgFillPrice: weightedPrice / (totalQty || 1),
      totalQty,
      venuesUsed: results.length
    };
  }
}

module.exports = MultiExchangeExecutor;
