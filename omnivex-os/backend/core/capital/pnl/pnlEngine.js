/**
 * OMNIVEX PnL ENGINE (REAL ACCOUNT TRACKING)
 */

const exchange = require("../../exchange/client");
const portfolio = require("../metrics/portfolioState");

class PnLEngine {

  async syncAccount() {
    const balance = await exchange.getBalance();

    const totalUSDT =
      balance.total?.USDT ||
      balance.free?.USDT ||
      0;

    portfolio.updateEquity(totalUSDT);

    return {
      equity: totalUSDT,
      raw: balance
    };
  }

  async calculateUnrealizedPnL(positions) {
    let totalPnL = 0;

    for (const pos of positions) {
      const ticker = await exchange.getTicker(pos.symbol);

      const currentPrice = ticker.last;
      const entryPrice = pos.entryPrice || currentPrice;

      const pnl =
        (currentPrice - entryPrice) *
        (pos.amount || 0);

      totalPnL += pnl;
    }

    return totalPnL;
  }

  async snapshot() {
    const balance = await this.syncAccount();
    const positions = await exchange.fetchPositions();

    const unrealized = await this.calculateUnrealizedPnL(positions);

    return {
      equity: balance.equity,
      unrealizedPnL: unrealized,
      timestamp: Date.now()
    };
  }
}

module.exports = new PnLEngine();
