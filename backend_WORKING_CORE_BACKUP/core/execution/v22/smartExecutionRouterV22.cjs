/**
 * SAINT V22 — SMART EXECUTION ROUTER
 * ----------------------------------
 * Final decision layer before execution
 */

class SmartExecutionRouterV22 {

  constructor(aegis) {
    this.aegis = aegis;
  }

  // ---------------------------
  // MAIN DECISION FUNCTION
  // ---------------------------
  decide(context) {

    const {
      signal,
      portfolio,
      marketState,
      flow,
      toxicity,
      regime,
      venues,
      coherence
    } = context;

    // 1. AEGIS HARD RISK CHECK
    const risk = this.aegis.evaluate(signal, portfolio, marketState);

    if (!risk.allowed) {
      return this.block(risk, "AEGIS_BLOCK");
    }

    // 2. FLOW VALIDATION
    if (flow.signal === "DISTRIBUTION") {
      return this.reduce(signal, "TOXIC_DISTRIBUTION_FLOW");
    }

    // 3. TOXICITY CHECK
    if (toxicity.score > 0.7) {
      return this.block({}, "TOXIC_MARKET_STRUCTURE");
    }

    // 4. REGIME ADJUSTMENT
    const adjustedSignal = this.adjustForRegime(signal, regime);

    // 5. SIZE ADJUSTMENT
    const size = this.adjustSize(adjustedSignal, flow, portfolio);

    // 6. VENUE SELECTION
    const venuePlan = this.selectVenues(venues, flow, toxicity, coherence);

    return {
      action: "EXECUTE",
      signal: adjustedSignal.signal,
      size,
      urgency: this.urgency(flow, regime),
      venues: venuePlan,
      riskScore: risk.riskScore
    };
  }

  // ---------------------------
  // REGIME ADJUSTMENT
  // ---------------------------
  adjustForRegime(signal, regime) {

    if (regime.volatility === "CHAOTIC") {
      signal.confidence *= 0.5;
    }

    if (regime.liquidity === "DISLOCATED") {
      signal.confidence *= 0.6;
    }

    if (regime.trend === "BREAKOUT") {
      signal.confidence *= 1.2;
    }

    return signal;
  }

  // ---------------------------
  // SIZE ADJUSTMENT ENGINE
  // ---------------------------
  adjustSize(signal, flow, portfolio) {

    let base = signal.confidence * 0.1;

    if (flow.signal === "ACCUMULATION") base *= 1.2;
    if (flow.signal === "DISTRIBUTION") base *= 0.5;

    if (portfolio.riskScore > 0.5) base *= 0.7;

    return Math.max(0, Math.min(1, base));
  }

  // ---------------------------
  // VENUE SELECTION LOGIC
  // ---------------------------
  selectVenues(venues, flow, toxicity, coherence) {

    return venues
      .map(v => {

        let score = v.score;

        if (flow.strength > 0.6) score += 0.1;
        if (toxicity.score > 0.5) score -= 0.2;
        if (coherence < 0.3) score -= 0.2;

        return {
          venue: v.venue,
          score
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
  }

  // ---------------------------
  // URGENCY MODEL
  // ---------------------------
  urgency(flow, regime) {

    if (flow.strength > 0.7 && regime.trend === "BREAKOUT") {
      return "HIGH";
    }

    if (regime.volatility === "CHAOTIC") {
      return "LOW";
    }

    return "MEDIUM";
  }

  // ---------------------------
  // BLOCK RESPONSE
  // ---------------------------
  block(reason, tag) {

    return {
      action: "BLOCK",
      reason,
      tag
    };
  }

  // ---------------------------
  // REDUCE POSITION
  // ---------------------------
  reduce(signal, reason) {

    return {
      action: "REDUCE",
      reason,
      signal: signal.signal,
      adjustedConfidence: signal.confidence * 0.5
    };
  }
}

module.exports = SmartExecutionRouterV22;
