/**
 * =========================================================
 * ELOHIM V2 — ADAPTIVE WEIGHTING KERNEL
 * Online performance-weighted decision system
 * =========================================================
 */

class ElohimV2 {
  constructor(agents = []) {
    this.agents = agents;

    // initial equal weighting
    this.weights = new Map();

    agents.forEach(a => {
      this.weights.set(a, 1.0);
    });

    this.history = [];
  }

  // -------------------------------
  // NORMALIZE WEIGHTS
  // -------------------------------
  normalize() {
    const total = Array.from(this.weights.values())
      .reduce((a, b) => a + b, 0);

    for (const [k, v] of this.weights.entries()) {
      this.weights.set(k, v / (total || 1));
    }
  }

  // -------------------------------
  // AGGREGATE SIGNALS
  // -------------------------------
  decide(context) {
    const votes = [];

    for (const agent of this.agents) {
      if (!agent || typeof agent.signal !== "function") {
        console.warn("[ELOHIM] Invalid agent skipped");
        continue;
      }

      const vote = agent.signal(context);
      if (!vote) continue;

      const weight = this.weights.get(agent) || 1;

      votes.push({
        signal: vote.signal,
        strength: vote.strength,
        weight
      });
    }

    // -------------------------------
    // SCORING SYSTEM
    // -------------------------------
    let buy = 0;
    let sell = 0;
    let hold = 0;

    for (const v of votes) {
      const impact = v.strength * v.weight;

      if (v.signal === "BUY") buy += impact;
      else if (v.signal === "SELL") sell += impact;
      else hold += impact;
    }

    const decision =
      buy > sell && buy > hold ? "BUY" :
      sell > buy && sell > hold ? "SELL" :
      "HOLD";

    return {
      allowed: true,
      decision,
      votes
    };
  }

  // -------------------------------
  // LEARNING UPDATE (KEY PART)
  // -------------------------------
  update(context, result) {
    // result: { pnl }

    const reward = result.pnl || 0;

    for (const agent of this.agents) {
      const weight = this.weights.get(agent) || 1;

      let delta = 0;

      // reward alignment heuristic
      const vote = agent.signal(context);

      if (!vote) continue;

      if (reward > 0 && vote.signal === "BUY") delta = 0.05;
      if (reward > 0 && vote.signal === "SELL") delta = -0.02;

      if (reward < 0 && vote.signal === "BUY") delta = -0.05;
      if (reward < 0 && vote.signal === "SELL") delta = 0.03;

      this.weights.set(agent, weight + delta);
    }

    this.normalize();

    this.history.push({
      context,
      reward,
      weights: Object.fromEntries(
        Array.from(this.weights.entries()).map(([k, v]) => [k.name || "agent", v])
      )
    });
  }
}

module.exports = ElohimV2;
