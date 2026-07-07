/**
 * SAINT V67 — ELOHIM PRIME
 * Sovereign system-wide decision kernel
 */

class ElohimPrimeV67 {

  constructor(modules) {
    this.modules = modules;
    this.mode = "INIT";
  }

  // =====================================================
  // GLOBAL SYSTEM EVALUATION
  // =====================================================
  evaluate(state) {

    const {
      risk,
      regime,
      flow,
      execution,
      stability
    } = state;

    const riskScore = risk?.score || 0;
    const flowStrength = flow?.strength || 0;
    const execQuality = execution?.quality || 0;
    const stable = stability?.status === "STABLE";

    let mode = "NEUTRAL";

    // =====================================================
    // SURVIVAL FIRST RULE
    // =====================================================
    if (!stable || riskScore > 8) {
      mode = "SURVIVAL_LOCK";
    }

    // =====================================================
    // MANIPULATION OVERRIDE
    // =====================================================
    if (regime === "MANIPULATION") {
      mode = "SURVIVAL_ONLY";
    }

    // =====================================================
    // EXPANSION CONDITION
    // =====================================================
    if (flowStrength > 0.7 && execQuality > 0.6 && riskScore < 5) {
      mode = "AGGRESSIVE_EXPANSION";
    }

    this.mode = mode;

    return {
      mode,
      riskScore,
      flowStrength,
      execQuality,
      stable
    };
  }

  // =====================================================
  // FINAL SYSTEM COMMAND
  // =====================================================
  command(state) {

    const evalResult = this.evaluate(state);

    return {
      systemMode: evalResult.mode,
      allowTrading: evalResult.mode !== "SURVIVAL_LOCK",
      allowAggressiveEntries: evalResult.mode === "AGGRESSIVE_EXPANSION",
      throttle: evalResult.mode === "SURVIVAL_ONLY"
    };
  }
}

module.exports = ElohimPrimeV67;
