"use strict";

/**
 * ==========================================
 * CHRONICLE SIMULATION ENGINE v1
 * PREDICTIVE REPLAY SYSTEM
 * ==========================================
 */

import { get } from "./ledger.js";

/**
 * SIMULATE OUTCOME BASED ON HISTORICAL PATTERNS
 */
export function simulate(opportunity, decision) {
  const history = get();

  if (!history.length) {
    return {
      confidence: 0.5,
      expectedPnL: 0,
      regime: "UNKNOWN"
    };
  }

  let matches = 0;
  let wins = 0;
  let pnlSum = 0;

  for (const h of history) {
    if (!h.execution) continue;

    const match =
      h.opportunity?.direction === opportunity.direction &&
      Math.abs(h.opportunity?.score - opportunity.score) < 0.2;

    if (match) {
      matches++;

      const pnl = h.execution?.raw?.pnl || 0;
      pnlSum += pnl;

      if (pnl > 0) wins++;
    }
  }

  const confidence = matches > 0 ? wins / matches : 0.5;
  const expectedPnL = matches > 0 ? pnlSum / matches : 0;

  return {
    confidence,
    expectedPnL,
    sampleSize: matches
  };
}

/**
 * BOOST / PENALIZE DECISION BEFORE EXECUTION
 */
export function adjustDecision(decision, simulation) {
  const adjusted = { ...decision };

  // if historically bad → downgrade
  if (simulation.confidence < 0.4) {
    adjusted.confidence *= 0.7;
  }

  // if historically strong → boost
  if (simulation.confidence > 0.7) {
    adjusted.confidence *= 1.2;
  }

  // expected loss filter
  if (simulation.expectedPnL < 0) {
    adjusted.blockedBySimulation = true;
  }

  return adjusted;
}

export default {
  simulate,
  adjustDecision
};
