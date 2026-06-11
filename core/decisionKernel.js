// ============================================================
// SAINT OMNIVEX — DECISION KERNEL
// File: core/decisionKernel.js
// Single authority layer. Nothing executes without passing all gates.
// ============================================================

let state = {
  lastSignal: null,
  cooldownUntil: 0,
  lastPrice: null,
  consecutiveBlocks: 0
};

export function decisionKernel({ signal, confidence, risk, price, volatility }) {
  const now = Date.now();

  // GATE 1: Cooldown — prevents spam loops
  if (now < state.cooldownUntil) {
    state.consecutiveBlocks++;
    return { allow: false, reason: "COOLDOWN", gatesFailed: ["COOLDOWN"] };
  }

  // GATE 2: HOLD signals never execute
  if (!signal || signal === "HOLD") {
    return { allow: false, reason: "HOLD_SUPPRESSED", gatesFailed: ["HOLD"] };
  }

  // GATE 3: Hard confidence floor — 0.75 minimum
  if (typeof confidence !== "number" || confidence < 0.75) {
    state.consecutiveBlocks++;
    return { allow: false, reason: "LOW_CONFIDENCE", gatesFailed: ["CONFIDENCE"], confidence };
  }

  // GATE 4: Risk-adjusted confidence — HIGH risk needs 0.88+
  if (risk === "HIGH" && confidence < 0.88) {
    state.consecutiveBlocks++;
    return { allow: false, reason: "RISK_BLOCK", gatesFailed: ["RISK"], confidence, risk };
  }

  // GATE 5: Duplicate signal suppression
  if (signal === state.lastSignal) {
    state.consecutiveBlocks++;
    return { allow: false, reason: "DUPLICATE_SIGNAL", gatesFailed: ["DUPLICATE"] };
  }

  // GATE 6: Extreme volatility guard
  if (volatility === "EXTREME") {
    state.consecutiveBlocks++;
    return { allow: false, reason: "VOLATILITY_HALT", gatesFailed: ["VOLATILITY"] };
  }

  // ALL GATES PASSED — Approved
  const cooldownMs = risk === "HIGH" ? 12000 : 6000;
  state.lastSignal = signal;
  state.cooldownUntil = now + cooldownMs;
  state.consecutiveBlocks = 0;
  state.lastPrice = price;

  return {
    allow: true,
    reason: "APPROVED",
    signal,
    confidence,
    risk,
    price,
    timestamp: now,
    cooldownMs
  };
}

export function getKernelState() {
  return {
    ...state,
    cooldownRemaining: Math.max(0, state.cooldownUntil - Date.now())
  };
}

export function resetKernel() {
  state = {
    lastSignal: null,
    cooldownUntil: 0,
    lastPrice: null,
    consecutiveBlocks: 0
  };
}

