/**
 * AEGIS — RISK & EXECUTION GATE
 * --------------------------------
 * Acts as final arbiter before SAINT execution.
 *
 * Responsibilities:
 * - Validate SOPHIA signals
 * - Enforce risk thresholds
 * - Apply volatility suppression
 * - Reject unstable trades
 * - Scale down marginal signals
 */

export default function aegis(bus) {
  // =========================
  // CONFIG (TUNABLE RISK MODEL)
  // =========================
  const CONFIG = {
    MIN_STRENGTH: 0.55,        // absolute minimum signal strength
    HIGH_CONFIDENCE: 0.80,     // full approval threshold
    EXTREME_CONFIDENCE: 0.92,  // aggressive execution threshold
    VOLATILITY_LIMIT: 0.35     // synthetic risk cap
  };

  // =========================
  // INTERNAL STATE
  // =========================
  let lastTick = null;

  function computeVolatility(current) {
    if (!lastTick) {
      lastTick = current;
      return 0;
    }

    const delta = Math.abs(current - lastTick) / (lastTick || 1);
    lastTick = current;

    return delta;
  }

  function decide(signal) {
    const strength = signal?.strength ?? 0;
    const price = signal?.price ?? 1000;

    const volatility = computeVolatility(price);

    // =========================
    // HARD REJECTION RULES
    // =========================
    if (strength < CONFIG.MIN_STRENGTH) {
      return {
        approved: false,
        reason: "STRENGTH_TOO_LOW",
        adjustedStrength: 0
      };
    }

    if (volatility > CONFIG.VOLATILITY_LIMIT) {
      return {
        approved: false,
        reason: "VOLATILITY_TOO_HIGH",
        adjustedStrength: strength * 0.4
      };
    }

    // =========================
    // SCALING LOGIC
    // =========================
    let adjustedStrength = strength;

    if (strength >= CONFIG.EXTREME_CONFIDENCE) {
      adjustedStrength *= 1.1;
    } else if (strength >= CONFIG.HIGH_CONFIDENCE) {
      adjustedStrength *= 1.0;
    } else {
      adjustedStrength *= 0.7;
    }

    // =========================
    // FINAL DECISION
    // =========================
    return {
      approved: adjustedStrength > CONFIG.MIN_STRENGTH,
      reason: "OK",
      adjustedStrength
    };
  }

  // =========================
  // EVENT LISTENER
  // =========================
  bus.on("signal", (event) => {
    const decision = decide(event.payload || {});

    bus.emit("risk.decision", {
      id: event.id,
      original: event.payload,
      decision
    });

    if (decision.approved) {
      bus.emit("trade.approved", {
        id: event.id,
        strength: decision.adjustedStrength,
        source: "AEGIS"
      });
    } else {
      bus.emit("trade.rejected", {
        id: event.id,
        reason: decision.reason,
        source: "AEGIS"
      });
    }
  });

  return {
    name: "AEGIS",
    status: "ACTIVE",
    config: CONFIG
  };
}
