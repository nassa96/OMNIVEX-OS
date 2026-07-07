/**
 * OMNIVEX OS — CAPITAL ENGINE
 * Signal-driven allocation system (deterministic + auditable)
 */

export function createCapitalEngine({ bus, chronicle } = {}) {
  /**
   * =========================
   * INITIAL PORTFOLIO STATE
   * =========================
   */

  let portfolio = {
    BTC: 0.144,
    ETH: 0.25,
    ALT: 0.35,
    STABLE: 0.256
  };

  /**
   * =========================
   * SAFETY NORMALIZATION
   * =========================
   */

  function clamp(value, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizePortfolio(p) {
    const total = Object.values(p).reduce((a, b) => a + b, 0);

    if (total === 0) return p;

    for (const k of Object.keys(p)) {
      p[k] = p[k] / total;
    }

    return p;
  }

  /**
   * =========================
   * REBALANCE ENGINE
   * =========================
   */

  function applySignal(signal) {
    if (!signal) return;
    if (signal.type !== "MEME") return;

    const strength = clamp(signal.strength || 0);

    if (strength <= 0) return;

    /**
     * ALLOCATION PRESSURE MODEL
     * - meme strength increases risk exposure
     * - stablecoin reduces
     */

    const riskShift = strength * 0.02;
    const altShift = strength * 0.015;

    portfolio.ETH += riskShift;
    portfolio.ALT += altShift;
    portfolio.STABLE -= (riskShift + altShift);

    portfolio.STABLE = Math.max(portfolio.STABLE, 0.05);

    normalizePortfolio(portfolio);

    const snapshot = {
      type: "capital.rotation",
      ts: Date.now(),
      source: "CAPITAL_ENGINE",
      data: { ...portfolio },
      trigger: signal
    };

    chronicle?.append?.(snapshot);

    console.log("[CAPITAL ENGINE] ROTATION", portfolio);
  }

  /**
   * =========================
   * BUS INTEGRATION
   * =========================
   */

  if (bus?.onAny) {
    bus.onAny((event) => {
      if (event?.type === "signal.meme") {
        applySignal(event);
      }
    });
  }

  /**
   * =========================
   * PUBLIC API
   * =========================
   */

  return {
    getPortfolio: () => portfolio,
    applySignal
  };
}
