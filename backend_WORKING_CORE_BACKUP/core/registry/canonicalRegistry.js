"use strict";

/**
 * CANONICAL REGISTRY
 * Defines system truth, module authority, and execution boundaries
 */

export const CANONICAL = {
  kernel: "core/kernel/runtimeKernel.js",

  intelligence: {
    auryn: "core/auryn/auryn.js",
    prometheus: "core/opportunity/prometheus.js"
  },

  execution: {
    router: "core/execution/executionRouter.js",
    adapters: "core/execution/adapters"
  },

  risk: "core/risk/governor.js",

  portfolio: "core/portfolio/controller.js",

  memory: {
    chronicle: "core/chronicle/ledger.js"
  },

  market: {
    feed: "core/market/websocketFeed.js"
  }
};

export function resolve(pathKey) {
  return CANONICAL[pathKey];
}

export default {
  CANONICAL,
  resolve
};
