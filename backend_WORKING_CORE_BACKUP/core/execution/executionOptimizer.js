/**
 * SAINT v8 Execution Optimizer
 * Controls WHEN and HOW trades should execute
 */

import { getMicrostructure } from "../market/orderbook/microstructureEngine.js";

/**
 * Estimate slippage risk based on microstructure
 */
function estimateSlippage({ positionSize, micro }) {
  const spread = micro?.spread || 0;
  const imbalance = micro?.imbalance || 0;
  const depth = micro?.depth || 1;

  const depthPenalty = 1 / Math.max(depth, 1);
  const imbalanceRisk = Math.abs(imbalance);

  return (
    spread * 0.5 +
    positionSize * depthPenalty * 0.3 +
    imbalanceRisk * 0.2
  );
}

/**
 * Execution quality score (0–1)
 */
function executionScore({ micro, positionSize }) {
  if (!micro) return 0.5;

  const spreadScore = Math.max(0, 1 - micro.spread * 0.001);
  const depthScore = Math.min(1, micro.depth / 50);
  const imbalanceScore = 1 - Math.abs(micro.imbalance);

  const sizePenalty = Math.min(1, 1 / (positionSize + 0.01));

  return (
    spreadScore * 0.35 +
    depthScore * 0.35 +
    imbalanceScore * 0.2 +
    sizePenalty * 0.1
  );
}

/**
 * Decide whether execution is allowed now
 */
function shouldExecute({ decision, positionSize }) {
  const micro = getMicrostructure();

  if (!micro) {
    return {
      allow: true,
      reason: "NO_MICROSTRUCTURE_DATA"
    };
  }

  const score = executionScore({
    micro,
    positionSize
  });

  const slippage = estimateSlippage({
    positionSize,
    micro
  });

  // HARD GUARDRAILS
  if (micro.spread > 10) {
    return {
      allow: false,
      reason: "SPREAD_TOO_WIDE",
      score
    };
  }

  if (Math.abs(micro.imbalance) > 0.9) {
    return {
      allow: false,
      reason: "EXTREME_ORDER_IMBALANCE",
      score
    };
  }

  if (slippage > 1.5) {
    return {
      allow: false,
      reason: "HIGH_SLIPPAGE_RISK",
      score,
      slippage
    };
  }

  // SOFT THRESHOLD
  if (score < 0.45) {
    return {
      allow: false,
      reason: "LOW_EXECUTION_QUALITY",
      score,
      slippage
    };
  }

  return {
    allow: true,
    reason: "EXECUTION_APPROVED",
    score,
    slippage
  };
}

/**
 * Apply execution delay (micro timing optimization)
 */
function executionDelay(score) {
  if (score > 0.75) return 0;
  if (score > 0.55) return 500;
  return 1500;
}

export {
  shouldExecute,
  estimateSlippage,
  executionScore,
  executionDelay
};
