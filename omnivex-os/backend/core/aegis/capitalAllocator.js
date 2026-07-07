/**
 * AEGIS CAPITAL ALLOCATOR (RISK GOVERNED V2)
 */

const cerberus = require("../cerberus");
const compounding = require("../capital/compounding/compoundingEngine");
const riskGovernor = require("./risk/riskGovernorV2");

class CapitalAllocator {

  async generateAllocations() {
    const signals = await cerberus.getCerberusSignals();

    const allocations = [];

    for (const s of signals) {
      const base = compounding.calculatePositionSize(s);
      const riskAdjusted = riskGovernor.adjustPosition({
        symbol: s.symbol,
        conviction: s.conviction,
        volatility: s.priceChange24h
      });

      const finalSize = Math.min(base.sizeUSD, riskAdjusted.sizeUSD);

      if (riskAdjusted.approved && finalSize > 0) {
        allocations.push({
          symbol: s.symbol,
          sizeUSD: finalSize,
          conviction: s.conviction,
          riskAdjusted: true
        });
      }
    }

    return allocations;
  }

  async portfolioPlan() {
    const allocations = await this.generateAllocations();

    const riskStatus = riskGovernor.evaluatePortfolio();

    return {
      timestamp: Date.now(),
      risk: riskStatus,
      allocations
    };
  }
}

module.exports = new CapitalAllocator();
