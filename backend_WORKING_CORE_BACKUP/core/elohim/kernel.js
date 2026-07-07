/**
 * =========================================================
 * ELOHIM V3 — SUPERVISOR KERNEL (SINGLE AUTHORITY)
 * =========================================================
 * Role:
 * - central decision authority
 * - resolves agent conflicts
 * - enforces execution finality
 * =========================================================
 */

const AEGIS = require("../aegis/gate");

/**
 * AGENT REGISTRY (SWARM)
 */
const AGENTS = {
  SOPHIA: require("../sophia/signal"),
  FORGE: require("../forge/evolve"),
  CHRONICLE: require("../chronicle/db")
};

/**
 * =========================================================
 * PRIMARY DECISION FLOW
 * =========================================================
 */

function evaluate(tick) {
  const signals = [];

  // -----------------------------
  // 1. COLLECT AGENT OUTPUTS
  // -----------------------------

  if (AGENTS.SOPHIA?.generateSignal) {
    signals.push({
      agent: "SOPHIA",
      ...AGENTS.SOPHIA.generateSignal(tick)
    });
  }

  if (AGENTS.FORGE?.mutate) {
    signals.push({
      agent: "FORGE",
      ...AGENTS.FORGE.mutate(tick)
    });
  }

  // fallback safety
  if (signals.length === 0) {
    return {
      allowed: false,
      reason: "NO_AGENTS_AVAILABLE",
      signal: { signal: "HOLD", strength: 0 }
    };
  }

  // -----------------------------
  // 2. AGGREGATION (WEIGHTED)
  // -----------------------------

  let weighted = 0;
  let totalWeight = 0;

  for (const s of signals) {
    const w = s.weight || 1;
    const strength = s.strength || 0;

    weighted += strength * w;
    totalWeight += w;
  }

  const finalScore = weighted / Math.max(totalWeight, 1);

  const fusedSignal = {
    signal:
      finalScore > 0.75
        ? "BUY"
        : finalScore < 0.4
        ? "SELL"
        : "HOLD",

    strength: finalScore,
    reason: "ELOHIM_FUSION",
    agents: signals.map((s) => s.agent)
  };

  // -----------------------------
  // 3. FINAL AUTHORITY GATE
  // -----------------------------

  const decision = AEGIS.evaluate(fusedSignal, tick);

  return {
    allowed: decision.allowed,
    reason: decision.reason,
    score: decision.score,
    fusedSignal
  };
}

module.exports = {
  evaluate
};
