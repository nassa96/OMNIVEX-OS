/**
 * OMNIVEX CAPITAL CONDUCTOR
 * Single authority for portfolio allocation + capital distribution
 * This overrides all fragmented allocation engines
 */

const { getMarketSnapshot } = require("../system/snapshot");
const { getRiskProfile } = require("../aegis/riskGovernor");

// optional integrations (safe fallbacks if missing)
let getCerberusSignals = async () => [];
let getSophiaSignals = async () => [];

try {
  getCerberusSignals = require("../cerberus").getCerberusSignals;
} catch (e) {}

try {
  getSophiaSignals = require("../sophia/signalEngine").getSophiaSignals;
} catch (e) {}

class CapitalConductor {
  constructor() {
    this.lastDecision = null;
  }

  async evaluate() {
    const [market, risk, sophia, cerberus] = await Promise.all([
      getMarketSnapshot?.(),
      getRiskProfile?.(),
      getSophiaSignals?.(),
      getCerberusSignals?.()
    ]);

    const signals = {
      market: market || {},
      risk: risk || { riskBudget: 0.25 },
      sophia: sophia || [],
      cerberus: cerberus || []
    };

    const allocation = this.allocateCapital(signals);

    this.lastDecision = allocation;

    return allocation;
  }

  allocateCapital(signals) {
    const riskBudget = signals.risk.riskBudget ?? 0.25;

    // BASE PORTFOLIO (stable core allocation)
    const portfolio = {
      "BTC-USD": 0.45 * (1 - riskBudget),
      "ETH-USD": 0.25 * (1 - riskBudget),
      CASH: 0.15
    };

    // MEME / EARLY OPPORTUNITY ALLOCATION (CERBERUS)
    const opportunities = (signals.cerberus || [])
      .filter(x => x.score > 60)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    const specWeight = riskBudget;

    if (opportunities.length > 0) {
      const perAsset = specWeight / opportunities.length;

      opportunities.forEach((op) => {
        portfolio[op.asset] = perAsset;
      });
    } else {
      portfolio.CASH += specWeight;
    }

    return {
      timestamp: Date.now(),
      portfolio,
      riskBudget,
      regime: this.detectRegime(signals),
      confidence: this.calculateConfidence(signals)
    };
  }

  detectRegime(signals) {
    const vol = signals.market?.volatility ?? 0.5;

    if (vol > 0.7) return "risk-off";
    if (vol < 0.3) return "risk-on";
    return "neutral";
  }

  calculateConfidence(signals) {
    let score = 0.5;

    if (signals.sophia?.length) score += 0.2;
    if (signals.cerberus?.length) score += 0.2;
    if (signals.market) score += 0.1;

    return Math.min(score, 1);
  }
}

module.exports = new CapitalConductor();
