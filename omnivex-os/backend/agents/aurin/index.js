/**
 * AURIN — CAPITAL + STRATEGY ROUTER
 * Omnivex OS Prime
 */

export function createAURIN({ bus, chronicle }) {
  const state = {
    mode: "NEUTRAL",
    riskMultiplier: 1.0,
    sactionEnabled: true,
    lastRegime: null
  };

  /**
   * =========================
   * MARKET REGIME DETECTION
   * =========================
   */

  function detectRegime(event) {
    const price = event?.payload?.price || 0;

    // simple regime logic (can be upgraded later)
    if (price > 50000) return "HIGH_VOL";
    if (price > 20000) return "MID_VOL";
    return "LOW_VOL";
  }

  /**
   * =========================
   * CAPITAL ALLOCATION POLICY
   * =========================
   */

  function computeRisk(regime) {
    switch (regime) {
      case "HIGH_VOL":
        return 0.5;
      case "MID_VOL":
        return 1.0;
      case "LOW_VOL":
        return 1.5;
      default:
        return 1.0;
    }
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  if (bus?.onAny) {
    bus.onAny((event) => {
      if (!event) return;

      const regime = detectRegime(event);

      if (regime !== state.lastRegime) {
        state.lastRegime = regime;
        state.riskMultiplier = computeRisk(regime);

        // In extreme volatility, throttle execution
        state.sactionEnabled = regime !== "HIGH_VOL";

        const update = {
          id: event.id,
          type: "aurin.regime.update",
          source: "AURIN",
          timestamp: Date.now(),
          payload: {
            regime,
            riskMultiplier: state.riskMultiplier,
            sactionEnabled: state.sactionEnabled
          }
        };

        chronicle?.append?.(update);
        bus.emit?.("aurin.update", update);
      }
    });
  }

  /**
   * =========================
   * PUBLIC API
   * =========================
   */

  return {
    state
  };
}
