/**
 * SAINT V31 — VENUE MEMORY ENGINE
 * --------------------------------
 * Each exchange maintains independent:
 * - orderbook history
 * - flow history
 * - regime state
 * - execution context
 */

class VenueMemory {

  constructor(venue) {
    this.venue = venue;

    this.orderbooks = [];
    this.flows = [];
    this.regimes = [];
    this.executions = [];

    this.maxSize = 200;
  }

  recordOrderbook(book) {
    this.orderbooks.push(book);
    if (this.orderbooks.length > this.maxSize) {
      this.orderbooks.shift();
    }
  }

  recordFlow(flow) {
    this.flows.push(flow);
    if (this.flows.length > this.maxSize) {
      this.flows.shift();
    }
  }

  recordRegime(regime) {
    this.regimes.push({
      regime,
      ts: Date.now()
    });

    if (this.regimes.length > this.maxSize) {
      this.regimes.shift();
    }
  }

  recordExecution(exec) {
    this.executions.push(exec);
    if (this.executions.length > this.maxSize) {
      this.executions.shift();
    }
  }

  // ---------------------------
  // VENUE BEHAVIOR PROFILE
  // ---------------------------
  getProfile() {

    const recentFlows = this.flows.slice(-20);

    const sweepCount =
      recentFlows.filter(f => f.sweepUp || f.sweepDown).length;

    const ignitionCount =
      recentFlows.filter(f => f.ignitionUp || f.ignitionDown).length;

    const avgSpread =
      this.orderbooks.slice(-20)
        .reduce((a,b) => a + (b.spread || 0), 0) / 20 || 0;

    const liquidityInstability =
      Math.abs(
        (this.orderbooks.slice(-1)[0]?.liquidityScore || 0) -
        (this.orderbooks.slice(-20)[0]?.liquidityScore || 0)
      );

    return {
      venue: this.venue,
      sweepDensity: sweepCount / 20,
      ignitionDensity: ignitionCount / 20,
      avgSpread,
      liquidityInstability,
      executionHistory: this.executions.length
    };
  }
}

module.exports = VenueMemory;
