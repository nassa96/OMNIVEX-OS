/**
 * ELOHIM GOVERNOR v1
 * ------------------
 * SYSTEM AUTHORITY LAYER
 * - Controls execution permission
 * - Enforces kill-switch logic
 * - Applies global risk governance
 */

/* =========================
   SYSTEM STATE
========================= */

const state = {
  killSwitch: false,
  maxRisk: "MED",
  blockedSymbols: new Set(),
  circuitBreakerTriggered: false
}

/* =========================
   GOVERNOR STATE ACCESS
========================= */

export function getGovernorState() {
  return {
    killSwitch: state.killSwitch,
    maxRisk: state.maxRisk,
    circuitBreakerTriggered: state.circuitBreakerTriggered
  }
}

/* =========================
   EXECUTION PERMISSION LOGIC
========================= */

export function allowExecution(regime = "NEUTRAL") {
  if (state.killSwitch) return false
  if (state.circuitBreakerTriggered) return false

  // Hard block unstable regimes
  if (regime === "EXTREME_VOLATILITY") return false
  if (regime === "BLACK_SWAN") return false

  return true
}

/* =========================
   KILL SWITCH CONTROL
========================= */

export function triggerKillSwitch(reason = "MANUAL") {
  state.killSwitch = true
  console.log("🚨 ELOHIM KILL SWITCH ACTIVATED:", reason)
}

/* =========================
   RESET SYSTEM (SAFE MODE)
========================= */

export function resetGovernor() {
  state.killSwitch = false
  state.circuitBreakerTriggered = false
  console.log("🟢 ELOHIM GOVERNOR RESET")
}

/* =========================
   CIRCUIT BREAKER
========================= */

export function triggerCircuitBreaker() {
  state.circuitBreakerTriggered = true
  console.log("🛑 CIRCUIT BREAKER TRIGGERED (RISK SHUTDOWN)")
}
