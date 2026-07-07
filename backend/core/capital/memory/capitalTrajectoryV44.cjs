/**
 * SAINT V44 — CAPITAL MEMORY & TRAJECTORY ENGINE
 * ---------------------------------------------
 * Tracks capital evolution over time and learns optimal growth paths
 */

class CapitalTrajectoryV44 {

  constructor() {

    this.timeline = [];

    this.trajectories = {
      growth: [],
      stagnation: [],
      drawdown: [],
      recovery: []
    };
  }

  // =====================================================
  // RECORD CAPITAL STATE
  // =====================================================
  record(state) {

    const entry = {
      capital: state.capital,
      pnl: state.pnl || 0,
      drawdown: state.drawdown || 0,
      volatility: state.volatility || 0,
      regime: state.regime || "NEUTRAL",
      ts: Date.now()
    };

    this.timeline.push(entry);

    if (this.timeline.length > 1000) {
      this.timeline.shift();
    }

    this._classify(entry);

    return entry;
  }

  // =====================================================
  // CLASSIFY CAPITAL STATE
  // =====================================================
  _classify(entry) {

    const { pnl, drawdown } = entry;

    if (pnl > 0.02) {
      this.trajectories.growth.push(entry);
    } else if (Math.abs(pnl) < 0.005) {
      this.trajectories.stagnation.push(entry);
    } else if (drawdown > 0.05) {
      this.trajectories.drawdown.push(entry);
    } else {
      this.trajectories.recovery.push(entry);
    }
  }

  // =====================================================
  // ANALYZE TRAJECTORY HEALTH
  // =====================================================
  analyze() {

    const growthRate =
      this.trajectories.growth.length / (this.timeline.length || 1);

    const drawdownPressure =
      this.trajectories.drawdown.length / (this.timeline.length || 1);

    const stagnationRisk =
      this.trajectories.stagnation.length / (this.timeline.length || 1);

    return {
      growthRate,
      drawdownPressure,
      stagnationRisk,
      healthScore:
        (growthRate * 2) -
        (drawdownPressure * 1.5) -
        (stagnationRisk * 1.0)
    };
  }

  // =====================================================
  // PREDICT CAPITAL FUTURE STATE
  // =====================================================
  forecast(capital, steps = 10) {

    const analysis = this.analyze();

    let projected = capital;

    for (let i = 0; i < steps; i++) {

      projected *= (1 + analysis.growthRate - analysis.drawdownPressure);
    }

    return {
      projectedCapital: projected,
      analysis
    };
  }

  // =====================================================
  // BEST HISTORICAL STATES
  // =====================================================
  bestStates() {

    return this.trajectories.growth
      .sort((a, b) => b.pnl - a.pnl)
      .slice(0, 10);
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      totalRecords: this.timeline.length,
      trajectories: {
        growth: this.trajectories.growth.length,
        stagnation: this.trajectories.stagnation.length,
        drawdown: this.trajectories.drawdown.length,
        recovery: this.trajectories.recovery.length
      }
    };
  }
}

module.exports = CapitalTrajectoryV44;
