/**
 * OMNIVEX FORGE — STRATEGY MUTATION ENGINE
 */

export function mutateStrategy(strategy = {}) {
  return {
    ...strategy,
    threshold: (strategy.threshold || 0.5) + (Math.random() - 0.5) * 0.05,
    riskLimit: Math.max(0.01, (strategy.riskLimit || 0.02) + (Math.random() - 0.5) * 0.005),
    version: (strategy.version || 1) + 1
  };
}
