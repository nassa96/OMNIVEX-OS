/**
 * AEGIS RISK GOVERNOR V2
 *
 * HARD CAPITAL PROTECTION LAYER
 * Sits between AEGIS allocator and SAINT execution
 */

const portfolio = require("../../capital/metrics/portfolioState");

class RiskGovernorV2 {
  constructor() {
    this.state = {
      consecutiveLosses: 0,
      lastEquity: 10000,
      emergencyStop: false
    };

    // HARD LIMITS
    this.limits = {
      maxDrawdown: 0.25,        // 25% kill switch
      maxPositionRisk: 0.05,    // 5% per trade max
      lossStreakLimit: 5,       // 5 consecutive losses
      volatilityThrottle: 0.6   // reduces exposure in chaos
    };
  }

  evaluatePortfolio() {
    const state = portfolio.getState();

    const drawdown = state.drawdown || 0;

    if (drawdown >= this.limits.maxDrawdown) {
      this.state.emergencyStop = true;
    }

    return {
      drawdown,
      equity: state.equity,
      emergencyStop: this.state.emergencyStop
    };
  }

  adjustPosition(signal) {
    const portfolioState = portfolio.getState();

    const drawdown = portfolioState.drawdown || 0;

    // base risk
    let riskMultiplier = 1;

    // 1. drawdown protection
    if (drawdown > 0.15) riskMultiplier *= 0.5;
    if (drawdown > 0.20) riskMultiplier *= 0.3;

    // 2. emergency kill switch
    if (this.state.emergencyStop) {
      riskMultiplier = 0;
    }

    // 3. consecutive loss throttle
    if (this.state.consecutiveLosses >= this.limits.lossStreakLimit) {
      riskMultiplier *= 0.2;
    }

    // 4. volatility control
    if (signal.volatility && signal.volatility > 0.8) {
      riskMultiplier *= this.limits.volatilityThrottle;
    }

    // 5. conviction scaling (from Cerberus)
    const convictionMultiplier =
      signal.conviction === "HIGH" ? 1 :
      signal.conviction === "MEDIUM" ? 0.6 : 0.3;

    const baseRisk = this.limits.maxPositionRisk;

    const finalRisk = baseRisk * riskMultiplier * convictionMultiplier;

    const positionSize = portfolioState.equity * finalRisk;

    return {
      symbol: signal.symbol,
      approved: !this.state.emergencyStop,
      sizeUSD: Math.max(positionSize, 0),
      riskMultiplier,
      conviction: signal.conviction
    };
  }

  registerTradeResult(result) {
    // result: { pnl: number }

    if (result.pnl < 0) {
      this.state.consecutiveLosses += 1;
    } else {
      this.state.consecutiveLosses = 0;
    }
  }

  status() {
    return {
      emergencyStop: this.state.emergencyStop,
      consecutiveLosses: this.state.consecutiveLosses,
      limits: this.limits
    };
  }
}

module.exports = new RiskGovernorV2();
