/**
 * =========================================================
 * OMNIVEX EVOLUTION KERNEL
 * A + B + C SYSTEM:
 * 1. Chronicle Learning Attribution
 * 2. ELOHIM Voting Council
 * 3. Execution Adapter (Paper + Live Hook Ready)
 * =========================================================
 */

const CHRONICLE = require("../chronicle");

// =========================================================
// AGENT MEMORY WEIGHTS (LEARNING STATE)
// =========================================================

const agentStats = {
  SOPHIA: { weight: 1.0, pnl: 0 },
  FORGE: { weight: 1.0, pnl: 0 }
};

// =========================================================
// A — LEARNING ATTRIBUTION ENGINE
// =========================================================

function attributeLearning(event) {
  const { signal, pnl } = event;

  const contrib = signal?.sources || {};

  // reward split by contribution strength
  const s = contrib.SOPHIA || 0.5;
  const f = contrib.FORGE || 0.5;

  const total = s + f;

  const sophiaShare = total ? s / total : 0.5;
  const forgeShare = total ? f / total : 0.5;

  const reward = pnl || 0;

  agentStats.SOPHIA.pnl += reward * sophiaShare;
  agentStats.FORGE.pnl += reward * forgeShare;

  // adaptive weight shift (slow learning)
  agentStats.SOPHIA.weight += (reward > 0 ? 0.01 : -0.005) * sophiaShare;
  agentStats.FORGE.weight += (reward > 0 ? 0.01 : -0.005) * forgeShare;

  // clamp
  agentStats.SOPHIA.weight = Math.max(0.2, Math.min(3, agentStats.SOPHIA.weight));
  agentStats.FORGE.weight = Math.max(0.2, Math.min(3, agentStats.FORGE.weight));

  return agentStats;
}

// =========================================================
// B — ELOHIM V3 VOTING COUNCIL
// =========================================================

function ELOHIM_V3(signal, regime, capital) {
  const votes = [];

  // Risk vote
  votes.push({
    name: "RISK",
    approve: capital.drawdown < 0.25
  });

  // Regime vote
  votes.push({
    name: "REGIME",
    approve: regime.regime !== "VOLATILE" || signal.strength > 0.75
  });

  // Signal vote
  votes.push({
    name: "SIGNAL",
    approve: signal.signal !== "HOLD"
  });

  const approvals = votes.filter(v => v.approve).length;

  return {
    allowed: approvals >= 2,
    votes
  };
}

// =========================================================
// C — EXECUTION ADAPTER (SAFE + EXTENSIBLE)
// =========================================================

async function execute(decision, context) {
  // SAFE MODE FIRST (no real trading unless enabled)
  const MODE = process.env.EXEC_MODE || "PAPER";

  if (!decision.allowed) {
    return { executed: false, reason: "BLOCKED_BY_ELOHIM" };
  }

  if (MODE === "PAPER") {
    return {
      executed: true,
      mode: "PAPER",
      pnlSim: (Math.random() - 0.5) * (context.capital?.positionSize || 1)
    };
  }

  // LIVE HOOK STUB (Binance/Coinbase ready)
  if (MODE === "LIVE") {
    return {
      executed: false,
      reason: "LIVE_MODE_NOT_CONFIGURED",
      hint: "Add exchange API integration here"
    };
  }

  return { executed: false, reason: "UNKNOWN_MODE" };
}

// =========================================================
// EXPORT
// =========================================================

module.exports = {
  attributeLearning,
  ELOHIM_V3,
  execute,
  agentStats
};
