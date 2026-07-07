/**
 * SAINT V56 — UNIFIED RISK GOVERNOR
 * Replaces fragmented risk systems (aegis, gate, firewall, killswitch, circuit breaker)
 */

class UnifiedRiskGovernorV56 {

  constructor({
    circuitBreaker,
    aegis,
    gate,
    firewall,
    killswitch,
    multiAssetExposure
  }) {

    this.circuitBreaker = circuitBreaker;
    this.aegis = aegis;
    this.gate = gate;
    this.firewall = firewall;
    this.killswitch = killswitch;
    this.multiAssetExposure = multiAssetExposure;
  }

  // =====================================================
  // CORE RISK AGGREGATION
  // =====================================================
  evaluate(market, signal, positionEngine) {

    const cb = this.circuitBreaker?.evaluate(market, positionEngine) || {};
    const aegis = this.aegis?.evaluate?.(signal) || {};
    const gate = this.gate?.evaluate?.(signal) || {};
    const firewall = this.firewall?.evaluate?.(market) || {};
    const kill = this.killswitch?.status?.() || { halted: false };
    const exposure = this.multiAssetExposure?.evaluate?.(positionEngine) || {};

    // =====================================================
    // RISK VECTOR BUILD
    // =====================================================
    const riskVector = {
      circuitBreaker: cb.halted ? 1 : 0,
      aegisBlock: aegis.block ? 1 : 0,
      gateBlock: gate.block ? 1 : 0,
      firewallBlock: firewall.block ? 1 : 0,
      killSwitch: kill.halted ? 1 : 0,
      exposureRisk: exposure.level || 0
    };

    // =====================================================
    // RISK SCORE
    // =====================================================
    const score =
      riskVector.circuitBreaker * 3 +
      riskVector.aegisBlock * 2 +
      riskVector.gateBlock * 2 +
      riskVector.firewallBlock * 2 +
      riskVector.killSwitch * 5 +
      riskVector.exposureRisk * 1.5;

    // =====================================================
    // FINAL DECISION
    // =====================================================
    let decision = "ALLOW";

    if (score >= 5) decision = "BLOCK";
    if (score >= 8) decision = "HALT_SYSTEM";

    return {
      decision,
      score,
      riskVector
    };
  }
}

module.exports = UnifiedRiskGovernorV56;
