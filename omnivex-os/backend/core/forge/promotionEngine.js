import { scoreStrategy } from "./scoringEngine.js";

/**
 * OMNIVEX FORGE — PROMOTION ENGINE
 */

export function evaluateAndPromote(strategy, events) {
  const score = scoreStrategy(events);

  const promoted = score.score > 0.02;

  return {
    promoted,
    score,
    strategy: promoted ? strategy : null
  };
}
