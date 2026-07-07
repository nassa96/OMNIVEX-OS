/**
 * AEGIS CIRCUIT BREAKER V2
 * Standardized engine interface: .run()
 */

let SYSTEM_LOCK = false;

const THRESHOLDS = {
  SYMBOL_VOLATILITY: 80,
  SYSTEM_VOLATILITY: 120
};

class AegisEngine {
  run({ symbol, price, prev }) {
    const delta = Math.abs(price - prev);

    const risk =
      delta > 50 ? "HIGH" :
      delta > 20 ? "MEDIUM" :
      "LOW";

    const kill = delta > THRESHOLDS.SYMBOL_VOLATILITY;

    if (kill) {
      SYSTEM_LOCK = true;
    }

    return {
      type: "AEGIS_RISK",
      symbol,
      volatility: delta,
      risk,
      kill,
      systemLock: SYSTEM_LOCK
    };
  }

  reset() {
    SYSTEM_LOCK = false;
  }

  isLocked() {
    return SYSTEM_LOCK;
  }
}

export const aegis = new AegisEngine();
