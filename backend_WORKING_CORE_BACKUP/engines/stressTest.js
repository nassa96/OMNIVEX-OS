/**
 * STRESS TEST ENGINE V1
 * Market shock + system resilience simulator
 */

let STRESS_MODE = false;
let intensity = 0; // 0–1

/* =========================
   CONTROL
========================= */
export function enableStressTest(level = 0.5) {
  STRESS_MODE = true;
  intensity = Math.max(0, Math.min(1, level));
}

export function disableStressTest() {
  STRESS_MODE = false;
  intensity = 0;
}

export function isStressActive() {
  return STRESS_MODE;
}

/* =========================
   PRICE SHOCK ENGINE
========================= */
export function applyStress(price) {
  if (!STRESS_MODE) return price;

  const shock = (Math.random() - 0.5) * 2 * intensity;

  // exponential distortion for chaos simulation
  const distorted = price * (1 + shock);

  return Math.max(distorted, price * (1 - 0.25 * intensity));
}

/* =========================
   VOLATILITY INJECTION
========================= */
export function stressVolatility(baseVol) {
  if (!STRESS_MODE) return baseVol;

  return baseVol * (1 + intensity * 5);
}

/* =========================
   REGIME OVERRIDE HOOK
========================= */
export function stressRegimeOverride(regime) {
  if (!STRESS_MODE) return regime;

  if (intensity > 0.7) {
    return {
      type: "MARKET_REGIME",
      regime: "CHAOS_EVENT",
      metrics: {
        volatility: 1,
        trend: 0,
        stressInjected: true
      }
    };
  }

  return regime;
}
