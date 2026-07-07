/**
 * OMNIVEX OS PRIME — AEGIS RISK ENGINE
 * Deterministic risk validation layer
 */

export function createAegis() {

  function evaluate(intent) {
    
    // HARD RULES (NO RANDOMNESS)
    let score = 0;

    if (!intent) {
      return { approved: false, reason: "empty_intent", score: 0 };
    }

    if (intent.size && intent.size > 1000) score += 1;
    if (intent.leverage && intent.leverage > 5) score += 2;
    if (intent.asset === "UNKNOWN") score += 3;

    const approved = score < 3;

    return {
      approved,
      score,
      reason: approved ? "ok" : "risk_threshold_exceeded"
    };
  }

  return {
    evaluate
  };
}
