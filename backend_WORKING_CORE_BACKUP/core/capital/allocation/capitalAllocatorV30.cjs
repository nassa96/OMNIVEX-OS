/**
 * SAINT V30 — CAPITAL ALLOCATION ENGINE
 * -------------------------------------
 * Dynamically distributes capital across execution agents
 */

class CapitalAllocatorV30 {

  constructor() {

    this.agentPerformance = {
      trend: { pnl: 0, winRate: 0, risk: 0 },
      meanReversion: { pnl: 0, winRate: 0, risk: 0 },
      toxicSurvivor: { pnl: 0, winRate: 0, risk: 0 },
      liquidityHunter: { pnl: 0, winRate: 0, risk: 0 }
    };

    this.capitalWeights = {
      trend: 0.25,
      meanReversion: 0.25,
      toxicSurvivor: 0.25,
      liquidityHunter: 0.25
    };
  }

  // =====================================================
  // UPDATE PERFORMANCE METRICS
  // =====================================================
  updatePerformance(agent, result) {

    if (!this.agentPerformance[agent]) return;

    const a = this.agentPerformance[agent];

    a.pnl += result.pnl || 0;
    a.winRate = result.win ? (a.winRate + 1) / 2 : a.winRate * 0.95;
    a.risk += result.risk || 0;
  }

  // =====================================================
  // CALCULATE ALLOCATION SCORE
  // =====================================================
  score(agent) {

    const p = this.agentPerformance[agent];

    const pnlScore = p.pnl;
    const winScore = p.winRate;
    const riskPenalty = p.risk;

    return (pnlScore * 1.5) + (winScore * 2) - (riskPenalty * 1.2);
  }

  // =====================================================
  // REBALANCE CAPITAL
  // =====================================================
  rebalance() {

    const agents = Object.keys(this.agentPerformance);

    let totalScore = 0;
    const scores = {};

    for (const a of agents) {
      const s = this.score(a);
      scores[a] = Math.max(s, 0);
      totalScore += scores[a];
    }

    if (totalScore === 0) {
      return this.capitalWeights;
    }

    for (const a of agents) {
      this.capitalWeights[a] = scores[a] / totalScore;
    }

    return this.capitalWeights;
  }

  // =====================================================
  // GET ALLOCATION FOR EXECUTION
  // =====================================================
  allocate(totalCapital) {

    const weights = this.rebalance();

    const allocation = {};

    for (const agent in weights) {
      allocation[agent] = totalCapital * weights[agent];
    }

    return allocation;
  }

  // =====================================================
  // SNAPSHOT
  // =====================================================
  snapshot() {

    return {
      weights: this.capitalWeights,
      performance: this.agentPerformance
    };
  }
}

module.exports = CapitalAllocatorV30;
