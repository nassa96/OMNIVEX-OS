/**
 * SAINT V29 — MULTI-AGENT EXECUTION SYSTEM
 * ----------------------------------------
 * Competing execution policies per market regime
 */

class MultiAgentExecutionV29 {

  constructor() {

    this.agents = {
      trend: new TrendAgent(),
      meanReversion: new MeanReversionAgent(),
      toxicSurvivor: new ToxicSurvivorAgent(),
      liquidityHunter: new LiquidityHunterAgent()
    };
  }

  // =====================================================
  // SELECT BEST AGENT
  // =====================================================
  selectAgent(context) {

    const scores = {};

    for (const [name, agent] of Object.entries(this.agents)) {
      scores[name] = agent.score(context);
    }

    const best = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])[0];

    return {
      agent: best[0],
      score: best[1]
    };
  }

  // =====================================================
  // EXECUTE VIA SELECTED AGENT
  // =====================================================
  execute(signal, context) {

    const selected = this.selectAgent(context);

    const agent = this.agents[selected.agent];

    return agent.execute(signal, context);
  }
}

/* =========================
   AGENT DEFINITIONS
   ========================= */

class TrendAgent {

  score(ctx) {

    let score = 0;

    if (ctx.regime === "TRENDING") score += 1;
    if (ctx.flow?.state === "ACCUMULATION") score += 0.5;
    if (ctx.sweep?.engineeredMove) score -= 1;

    return score;
  }

  execute(signal, ctx) {

    return {
      type: "TREND",
      size: signal.size * 1.3,
      confidence: signal.confidence
    };
  }
}

class MeanReversionAgent {

  score(ctx) {

    let score = 0;

    if (ctx.sweep?.high || ctx.sweep?.low) score += 1;
    if (ctx.regime === "RANGE") score += 1;

    return score;
  }

  execute(signal, ctx) {

    return {
      type: "MEAN_REVERSION",
      size: signal.size * 0.8,
      confidence: signal.confidence
    };
  }
}

class ToxicSurvivorAgent {

  score(ctx) {

    let score = 0;

    if (ctx.toxicity > 0.6) score += 2;
    if (ctx.sweep?.engineeredMove) score += 1;

    return score;
  }

  execute(signal, ctx) {

    return {
      type: "TOXIC_SURVIVOR",
      size: signal.size * 0.5,
      confidence: signal.confidence * 0.8
    };
  }
}

class LiquidityHunterAgent {

  score(ctx) {

    let score = 0;

    if (ctx.flow?.state === "ACCUMULATION") score += 1;
    if (ctx.flow?.flowPressure > 0.3) score += 0.5;

    return score;
  }

  execute(signal, ctx) {

    return {
      type: "LIQUIDITY_HUNTER",
      size: signal.size * 1.5,
      confidence: signal.confidence
    };
  }
}

module.exports = MultiAgentExecutionV29;
