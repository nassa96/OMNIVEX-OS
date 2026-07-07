/**
 * SAINT V55.1 — CIRCUIT OVERRIDE LAYER
 * Sits ABOVE existing risk system
 */

class CircuitBreakerV55_1 {

  constructor() {
    this.halted = false;
    this.lossStreak = 0;
    this.volSpike = 0;
  }

  evaluate(market, positionEngine) {

    const positions = positionEngine.snapshot ? positionEngine.snapshot() : {};

    const pnl = Object.values(positions)
      .reduce((s, p) => s + (p.pnl || 0), 0);

    // LOSS TRACKING
    if (pnl < -5) this.lossStreak++;
    else this.lossStreak = 0;

    // VOLATILITY TRACKING
    const spread = market?.liquidity?.spread || 0;

    if (spread > 0.5) this.volSpike++;
    else this.volSpike = 0;

    // TRIGGER HALT
    if (this.lossStreak >= 3 || this.volSpike >= 5) {
      this.halted = true;
    }

    return {
      halted: this.halted,
      lossStreak: this.lossStreak,
      volSpike: this.volSpike
    };
  }

  reset() {
    this.halted = false;
    this.lossStreak = 0;
    this.volSpike = 0;
  }
}

module.exports = CircuitBreakerV55_1;
