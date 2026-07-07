/**
 * OMNIVEX CANONICAL REGISTRY
 * SINGLE SOURCE OF TRUTH FOR ACTIVE MODULES
 *
 * This prevents:
 * - duplicate implementations
 * - import drift
 * - version conflicts
 */

export const CANONICAL = {
  MERCURY: {
    stream: "../mercury/stream.js",
    status: "ACTIVE"
  },

  SOPHIA: {
    engine: "../sophia/regimeEngine.js",
    status: "ACTIVE"
  },

  AURIN: {
    kernel: "../aurin/kernel.js",
    decision: "../aurin/decisionEngine.js",
    status: "ACTIVE"
  },

  SAINT: {
    execution: "../saint/executionEngine.js",
    router: "../saint/router/executionRouter.js",
    status: "ACTIVE"
  },

  CHRONICLE: {
    ledger: "../chronicle/chronicle.js",
    stream: "../chronicle/eventAdapter.js",
    replay: "../chronicle/replayEngine.js",
    status: "ACTIVE"
  },

  CAPITAL: {
    engine: "../capital/rotationEngine.js",
    status: "ACTIVE"
  },

  FORGE: {
    replay: "../forge/replayEngine.js",
    mutation: "../forge/mutationEngine.js",
    status: "ACTIVE"
  }
};

/**
 * Resolve canonical module path safely
 */
export function resolve(module, key) {
  return CANONICAL[module]?.[key] || null;
}

/**
 * Check system integrity
 */
export function validateRegistry() {
  const missing = [];

  for (const [mod, cfg] of Object.entries(CANONICAL)) {
    if (!cfg.status) missing.push(mod);
  }

  return {
    ok: missing.length === 0,
    missing
  };
}
