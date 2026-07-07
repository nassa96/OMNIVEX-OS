const PortfolioEngine = require("../core/portfolio/portfolioEngine.cjs");

/**
 * SAINT V17 — LIVE PORTFOLIO TRACKER
 */

class PortfolioTracker {

  constructor() {
    this.portfolio = new PortfolioEngine();
  }

  onTradeExecution(trade) {
    this.portfolio.applyTrade(trade);
  }

  onMarketUpdate(prices) {
    this.portfolio.updateMarketPrices(prices);
  }

  getState() {
    return this.portfolio.snapshot();
  }
}

module.exports = PortfolioTracker;
