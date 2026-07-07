/**
 * SAINT V17 — PORTFOLIO RISK BRIDGE
 * Feeds portfolio state into AEGIS risk engine
 */

class PortfolioRiskBridge {

  constructor(aegis, portfolio) {
    this.aegis = aegis;
    this.portfolio = portfolio;
  }

  evaluate(signal, market) {

    const portfolioState = this.portfolio.snapshot();

    const risk = this.aegis.evaluate(
      signal,
      portfolioState,
      market
    );

    return {
      ...risk,
      portfolioState
    };
  }
}

module.exports = PortfolioRiskBridge;
