/**
 * SAINT V41 — MARKET SURVIVAL OS LAYER
 * ------------------------------------
 * Tracks regime cycles and determines safe re-entry windows
 */

class SurvivalRegimeV41 {

  constructor() {

    this.regimes = {
      HOSTILE: { score: 0 },
      COOLING: { score: 0 },
      NEUTRAL: { score: 0 },
      EXPANSION: { score: 0 },
      EXHAUSTION: { score: 0 }
    };

    this.history = [];
  }

  // =====================================================
  // CLASSIFY CURRENT MARKET REGIME
  // =====================================================
  classify(context) {

    const {
      adversarialScore = 0,
      imbalance = 0,
      volatility = 0,
      trendStrength = 0
    } = context;

    let regime = "NEUTRAL";

    if (adversarialScore > 10) {
      regime = "HOSTILE";
    } else if (adversarialScore > 6) {
      regime = "COOLING";
    } else if (Math.abs(trendStrength) > 0.6) {
      regime = "EXPANSION";
    } else if (volatility > 0.7 && Math.abs(imbalance) < 0.2) {
      regime = "EXHAUSTION";
    }

    return regime;
  }

  // =====================================================
  // UPDATE REGIME MEMORY
  // =====================================================
  update(context) {

    const regime = this.classify(context);

    this.regimes[regime].score += 1;

    this.history.push({
      regime,
      ts: Date.now(),
      context
    });

    if (this.history.length > 500) {
      this.history.shift();
    }

    return regime;
  }

  // =====================================================
  // DETERMINE SAFE TO RE-ENTER
  // =====================================================
  canReEnter() {

    const last = this.history[this.history.length - 1];

    if (!last) return true;

    const recent = this.history.slice(-20);

    const hostileCount =
      recent.filter(r => r.regime === "HOSTILE").length;

    const coolingCount =
      recent.filter(r => r.regime === "COOLING").length;

    // -------------------------
    // STILL TOO HOSTILE
    // -------------------------
    if (hostileCount > 5) {
      return {
        safe: false,
        reason: "MARKET_STILL_HOSTILE"
      };
    }

    // -------------------------
    // TRANSITIONING TO STABILITY
    // -------------------------
    if (coolingCount > 8) {
      return {
        safe: true,
        reason: "MARKET_STABILIZING"
      };
    }

    return {
      safe: true,
      reason: "DEFAULT_SAFE_WINDOW"
    };
  }

  // =====================================================
  // FULL SURVIVAL STATE
  // =====================================================
  state() {

    return {
      regimes: this.regimes,
      last: this.history[this.history.length - 1] || null
    };
  }
}

module.exports = SurvivalRegimeV41;
