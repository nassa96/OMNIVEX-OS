/**
 * SAINT V37 — PORTFOLIO RISK COGNITION ENGINE
 * -------------------------------------------
 * Tracks system-wide exposure + risk state
 */

class PortfolioRisk {

  constructor() {
    this.positions = [];
    this.maxDrawdown = 0.2; // 20%
  }

  addPosition(position) {
    this.positions.push(position);
  }

  // ---------------------------
  // TOTAL EXPOSURE
  // ---------------------------
  getTotalExposure() {

    return this.positions.reduce((sum, p) => {
      return sum + (p.size || 0);
    }, 0);
  }

  // ---------------------------
  // RISK CONCENTRATION
  // ---------------------------
  getConcentrationRisk() {

    const map = {};

    for (const p of this.positions) {
      map[p.symbol] = (map[p.symbol] || 0) + p.size;
    }

    const values = Object.values(map);

    const max = Math.max(...values, 0);
    const total = values.reduce((a,b)=>a+b,0) || 1;

    return max / total;
  }

  // ---------------------------
  // SIMPLIFIED CORRELATION STRESS
  // ---------------------------
  getCorrelationStress() {

    if (this.positions.length < 2) return 0;

    let stress = 0;

    for (let i = 1; i < this.positions.length; i++) {
      const a = this.positions[i - 1];
      const b = this.positions[i];

      if (a.symbol === b.symbol) {
        stress += 0.2;
      } else {
        stress += 0.05;
      }
    }

    return Math.min(1, stress);
  }

  // ---------------------------
  // DRAWDOWN RISK
  // ---------------------------
  getDrawdownRisk(currentPnL) {

    if (!currentPnL) return 0;

    if (currentPnL < -this.maxDrawdown) {
      return 1;
    }

    return Math.abs(currentPnL) / this.maxDrawdown;
  }

  // ---------------------------
  // GLOBAL RISK STATE
  // ---------------------------
  getRiskState(currentPnL = 0) {

    const exposure = this.getTotalExposure();
    const concentration = this.getConcentrationRisk();
    const correlation = this.getCorrelationStress();
    const drawdown = this.getDrawdownRisk(currentPnL);

    const riskScore =
      (exposure * 0.2) +
      (concentration * 0.3) +
      (correlation * 0.2) +
      (drawdown * 0.3);

    return {
      exposure,
      concentration,
      correlation,
      drawdown,
      riskScore,
      state:
        riskScore > 0.8 ? "DANGEROUS" :
        riskScore > 0.5 ? "ELEVATED" :
        "NORMAL"
    };
  }
}

module.exports = PortfolioRisk;
