/**
 * OMNIVEX OS — CAPITAL ROTATION ENGINE v2
 * Dynamic portfolio allocator driven by regime + performance feedback
 */

export function createCapitalRotationEngine({ bus, chronicle, state } = {}) {
  if (!bus) throw new Error("Bus required for capital rotation engine");

  /**
   * =========================
   * PORTFOLIO STATE
   * =========================
   */

  let portfolio = {
    BTC: 0.25,
    ETH: 0.25,
    ALT: 0.25,
    STABLE: 0.25
  };

  /**
   * =========================
   * ROTATION LOGIC
   * =========================
   */

  function normalize(weights) {
    const sum = Object.values(weights).reduce((a, b) => a + b, 0);

    for (const k of Object.keys(weights)) {
      weights[k] = weights[k] / sum;
    }

    return weights;
  }

  function rotate(regime, pnl) {
    let w = { ...portfolio };

    /**
     * REGIME-BASED SHIFTING
     */

    if (regime === "MEME_EXPANSION") {
      w.ALT += 0.15;
      w.STABLE -= 0.15;
    }

    if (regime === "INSTITUTIONAL_FLOW") {
      w.BTC += 0.1;
      w.ETH += 0.1;
      w.STABLE -= 0.2;
    }

    if (regime === "ILLIQUID_RISK") {
      w.STABLE += 0.25;
      w.ALT -= 0.25;
    }

    /**
     * PNL FEEDBACK LOOP
     */

    if (pnl < 0) {
      w.STABLE += 0.1;
      w.BTC -= 0.05;
      w.ETH -= 0.05;
    }

    if (pnl > 0) {
      w.ALT += 0.05;
      w.STABLE -= 0.05;
    }

    portfolio = normalize(w);

    const event = {
      type: "capital.rotation",

      ts: Date.now(),

      portfolio
    };

    bus.emit(event.type, event);

    chronicle?.append?.(event);

    return portfolio;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    if (!event) return;

    if (event.type === "signal.sophia") {
      const regime = event.regime;
      const pnl = state?.get?.().pnl || 0;

      rotate(regime, pnl);
    }

    if (event.type === "execution.order.update") {
      const pnl = state?.get?.().pnl || 0;

      rotate("NEUTRAL", pnl);
    }
  });

  return {
    getPortfolio: () => portfolio
  };
}
