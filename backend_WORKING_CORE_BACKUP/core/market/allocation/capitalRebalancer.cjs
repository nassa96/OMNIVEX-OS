/**
 * SAINT V40 — CAPITAL REBALANCING ENGINE
 * --------------------------------------
 * Allocates capital across venues + regimes dynamically
 */

class CapitalRebalancer {

  constructor(positionEngine) {
    this.positions = positionEngine;

    this.capitalMap = {
      binance: 0.34,
      coinbase: 0.33,
      kraken: 0.33
    };

    this.regimeMap = {
      SWEEP: 1.0,
      IGNITION: 1.0,
      TOXIC: 1.0,
      NORMAL: 1.0
    };

    this.totalCapital = 10000;
  }

  // ---------------------------
  // ANALYZE VENUE PERFORMANCE
  // ---------------------------
  computeVenuePerformance() {

    const history = this.positions.history || [];

    const stats = {
      binance: { pnl: 0, count: 0 },
      coinbase: { pnl: 0, count: 0 },
      kraken: { pnl: 0, count: 0 }
    };

    for (const t of history) {
      if (!stats[t.venue]) continue;

      stats[t.venue].pnl += t.pnl || 0;
      stats[t.venue].count += 1;
    }

    const scores = {};

    for (const v of Object.keys(stats)) {

      const avg = stats[v].count
        ? stats[v].pnl / stats[v].count
        : 0;

      scores[v] = avg;
    }

    return scores;
  }

  // ---------------------------
  // REBALANCE CAPITAL ACROSS VENUES
  // ---------------------------
  rebalanceVenues() {

    const scores = this.computeVenuePerformance();

    const totalScore =
      Object.values(scores).reduce((a,b)=>a + Math.abs(b), 0) || 1;

    for (const v of Object.keys(this.capitalMap)) {

      const normalized = Math.abs(scores[v]) / totalScore;

      // reward positive performance
      const directionBias = scores[v] > 0 ? 1.2 : 0.8;

      this.capitalMap[v] =
        Math.max(0.1,
          Math.min(0.8, normalized * directionBias)
        );
    }

    // normalize to 1.0
    const sum = Object.values(this.capitalMap).reduce((a,b)=>a+b,0);

    for (const v of Object.keys(this.capitalMap)) {
      this.capitalMap[v] /= sum;
    }
  }

  // ---------------------------
  // REGIME CAPITAL SHIFTING
  // ---------------------------
  rebalanceRegimes() {

    const history = this.positions.history || [];

    const regimePnL = {
      SWEEP: 0,
      IGNITION: 0,
      TOXIC: 0,
      NORMAL: 0
    };

    const counts = { ...regimePnL };

    for (const t of history) {
      const r = t.regime || "NORMAL";

      regimePnL[r] += t.pnl || 0;
      counts[r] += 1;
    }

    for (const r of Object.keys(this.regimeMap)) {

      const avg =
        counts[r] ? regimePnL[r] / counts[r] : 0;

      const bias =
        avg > 0 ? 1.15 :
        avg < 0 ? 0.85 : 1;

      this.regimeMap[r] *= bias;

      this.regimeMap[r] =
        Math.max(0.2, Math.min(3, this.regimeMap[r]));
    }
  }

  // ---------------------------
  // CAPITAL ALLOCATION DECISION
  // ---------------------------
  allocate(venue, regime) {

    this.rebalanceVenues();
    this.rebalanceRegimes();

    const venueWeight = this.capitalMap[venue] || 0.33;
    const regimeWeight = this.regimeMap[regime] || 1.0;

    const allocation =
      this.totalCapital * venueWeight * regimeWeight;

    return {
      venue,
      regime,
      allocation,
      capitalMap: this.capitalMap,
      regimeMap: this.regimeMap
    };
  }
}

module.exports = CapitalRebalancer;
