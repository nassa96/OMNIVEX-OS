/**
 * SAINT V43 — PORTFOLIO CAPITAL ROTATION ENGINE
 * ---------------------------------------------
 * Dynamically reallocates capital across strategies and assets
 */

class CapitalRotationV43 {

  constructor() {

    this.strategies = {};
    this.assets = {};

    this.capitalMap = {};
  }

  // =====================================================
  // REGISTER STRATEGY PERFORMANCE
  // =====================================================
  updateStrategy(name, metrics) {

    this.strategies[name] = {
      pnl: metrics.pnl || 0,
      drawdown: metrics.drawdown || 0,
      winRate: metrics.winRate || 0,
      volatility: metrics.volatility || 0,
      timestamp: Date.now()
    };
  }

  // =====================================================
  // REGISTER ASSET PERFORMANCE
  // =====================================================
  updateAsset(symbol, metrics) {

    this.assets[symbol] = {
      trend: metrics.trend || 0,
      liquidity: metrics.liquidity || 0,
      volatility: metrics.volatility || 0,
      regimeFit: metrics.regimeFit || 0,
      timestamp: Date.now()
    };
  }

  // =====================================================
  // SCORE STRATEGY FITNESS
  // =====================================================
  scoreStrategy(s) {

    const data = this.strategies[s];

    if (!data) return 0;

    return (
      (data.pnl * 0.4) +
      (data.winRate * 0.3) -
      (data.drawdown * 0.2) -
      (data.volatility * 0.1)
    );
  }

  // =====================================================
  // SCORE ASSET FITNESS
  // =====================================================
  scoreAsset(a) {

    const data = this.assets[a];

    if (!data) return 0;

    return (
      (data.trend * 0.4) +
      (data.liquidity * 0.3) +
      (data.regimeFit * 0.3)
    );
  }

  // =====================================================
  // COMPUTE CAPITAL ROTATION MAP
  // =====================================================
  rotate(totalCapital = 1.0) {

    const strategyScores = {};
    const assetScores = {};

    for (const s in this.strategies) {
      strategyScores[s] = this.scoreStrategy(s);
    }

    for (const a in this.assets) {
      assetScores[a] = this.scoreAsset(a);
    }

    const totalStrategyScore =
      Object.values(strategyScores).reduce((a,b)=>a+b,0) || 1;

    const totalAssetScore =
      Object.values(assetScores).reduce((a,b)=>a+b,0) || 1;

    const allocation = [];

    // -------------------------
    // STRATEGY ALLOCATION
    // -------------------------
    for (const s in strategyScores) {

      const strategyWeight =
        strategyScores[s] / totalStrategyScore;

      // -------------------------
      // NESTED ASSET ALLOCATION
      // -------------------------
      for (const a in assetScores) {

        const assetWeight =
          assetScores[a] / totalAssetScore;

        const capitalShare =
          totalCapital * strategyWeight * assetWeight;

        allocation.push({
          strategy: s,
          asset: a,
          capital: capitalShare
        });
      }
    }

    return allocation;
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      strategies: this.strategies,
      assets: this.assets
    };
  }
}

module.exports = CapitalRotationV43;
