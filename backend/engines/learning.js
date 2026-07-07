/**
 * SELF-LEARNING LOOP V1
 * Deterministic performance scoring system
 */

const HISTORY = [];

/* =========================
   STORE OUTCOME
========================= */
export function recordOutcome(event) {
  const score = evaluate(event);

  HISTORY.push({
    ts: event.ts,
    symbol: event.symbol,
    decision: event.execution?.decision || "HOLD",
    regime: event.regime?.regime,
    strategy: event.strategy?.type,
    score
  });

  // keep memory bounded
  if (HISTORY.length > 5000) {
    HISTORY.shift();
  }

  return score;
}

/* =========================
   SIMPLE EVALUATION MODEL
========================= */
function evaluate(event) {
  const priceMove =
    (event.price - event.prev) / event.prev;

  const decision = event.execution?.decision;

  let score = 0;

  if (decision === "BUY") {
    score = priceMove > 0 ? 1 : -1;
  }

  if (decision === "SELL") {
    score = priceMove < 0 ? 1 : -1;
  }

  if (decision === "HOLD") {
    score = Math.abs(priceMove) < 0.002 ? 1 : 0;
  }

  // regime penalty/bonus
  if (event.regime?.regime === "CHAOS_EVENT") {
    score *= 0.5;
  }

  return score;
}

/* =========================
   STRATEGY PERFORMANCE
========================= */
export function getStrategyScores() {
  const map = {};

  for (const h of HISTORY) {
    if (!map[h.strategy]) {
      map[h.strategy] = { total: 0, count: 0 };
    }

    map[h.strategy].total += h.score;
    map[h.strategy].count += 1;
  }

  return map;
}

/* =========================
   REGIME PERFORMANCE
========================= */
export function getRegimeScores() {
  const map = {};

  for (const h of HISTORY) {
    if (!map[h.regime]) {
      map[h.regime] = { total: 0, count: 0 };
    }

    map[h.regime].total += h.score;
    map[h.regime].count += 1;
  }

  return map;
}
