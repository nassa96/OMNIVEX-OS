/**
 * SAINT V9 — LATENCY AWARE MARKET CLOCK ENGINE
 * --------------------------------------------
 * Aligns multi-exchange trades into a single causal timeline
 */

class LatencyClock {

  constructor() {

    // rolling latency estimates (ms)
    this.latency = {
      binance: 0,
      coinbase: 0
    };

    this.alpha = 0.05; // smoothing factor
  }

  // ---------------------------
  // UPDATE LATENCY ESTIMATE
  // ---------------------------
  updateLatency(venue, exchangeTs) {

    const now = Date.now();

    const observedLatency = now - exchangeTs;

    if (!this.latency[venue]) {
      this.latency[venue] = observedLatency;
      return;
    }

    // exponential moving average
    this.latency[venue] =
      this.alpha * observedLatency +
      (1 - this.alpha) * this.latency[venue];
  }

  // ---------------------------
  // NORMALIZE TRADE TIME
  // ---------------------------
  normalizeTrade(trade) {

    const latency = this.latency[trade.venue] || 0;

    return {
      ...trade,

      // corrected timestamp (causal estimate)
      correctedTs: trade.ts + latency,

      latencyEstimate: latency
    };
  }

  // ---------------------------
  // ORDER INTO CAUSAL FLOW
  // ---------------------------
  sortCausal(trades) {

    return trades.sort((a, b) =>
      a.correctedTs - b.correctedTs
    );
  }

  // ---------------------------
  // DETECT OUTLIER TIMING
  // ---------------------------
  detectTimingAnomalies(trades) {

    const anomalies = [];

    for (const t of trades) {

      const lag = t.latencyEstimate || 0;

      if (lag > 2000) {
        anomalies.push({
          venue: t.venue,
          issue: "HIGH_LATENCY",
          lag
        });
      }
    }

    return anomalies;
  }

  // ---------------------------
  // MARKET CLOCK SNAPSHOT
  // ---------------------------
  snapshot(trades) {

    const normalized = trades.map(t =>
      this.normalizeTrade(t)
    );

    const causal = this.sortCausal(normalized);

    return {
      causalStream: causal,
      anomalies: this.detectTimingAnomalies(causal),
      latencyModel: this.latency
    };
  }
}

module.exports = LatencyClock;
