"use strict";

/**
 * SAINT_PRIMAL REGISTRY LOADER v2
 * FULL BOOT + DEP GRAPH + MODULE RESOLUTION
 */

import path from "path";

const REGISTRY = {};

/**
 * Dependency graph (boot order + constraints)
 */
const DEP_GRAPH = {
  chronicle: [],
  prometheus: ["chronicle"],
  auryn: ["prometheus", "chronicle"],
  risk: ["chronicle"],
  execution: ["auryn", "risk"],
  kernel: ["prometheus", "auryn", "risk", "execution", "chronicle"]
};

/**
 * Required exports per module
 */
const CONTRACTS = {
  chronicle: ["record"],
  prometheus: ["score", "feedback"],
  auryn: ["vote", "feedback"],
  risk: ["allowExecution"],
  execution: ["route"],
  kernel: ["runTick"]
};

/**
 * Load single module safely
 */
async function load(name, fullPath) {
  try {
    const mod = await import(fullPath);

    const required = CONTRACTS[name];

    if (required) {
      for (const fn of required) {
        if (typeof mod[fn] !== "function") {
          throw new Error(`[REGISTRY] ${name} missing export: ${fn}`);
        }
      }
    }

    REGISTRY[name] = mod;

    return { name, status: "LOADED" };
  } catch (err) {
    return { name, status: "FAILED", error: err.message };
  }
}

/**
 * Boot registry in dependency order
 */
export async function bootRegistry(basePath) {
  const results = [];

  const order = [
    ["chronicle", "../chronicle/ledger.js"],
    ["prometheus", "../intelligence/prometheus/prometheus.js"],
    ["auryn", "../intelligence/auryn/votingEngine.js"],
    ["risk", "../risk/killswitch/riskKillSwitch.js"],
    ["execution", "../execution/router/executionRouter.js"],
    ["kernel", "../kernel/runtime/runtimeKernel.js"]
  ];

  for (const [name, rel] of order) {
    const fullPath = "file://" + path.resolve(basePath, rel);
    const res = await load(name, fullPath);
    results.push(res);
  }

  return {
    status: "BOOT_COMPLETE",
    registry: REGISTRY,
    results
  };
}

/**
 * Get module
 */
export function get(name) {
  return REGISTRY[name];
}

/**
 * Validate graph integrity
 */
export function validateGraph() {
  const errors = [];

  for (const [mod, deps] of Object.entries(DEP_GRAPH)) {
    for (const dep of deps) {
      if (!REGISTRY[dep]) {
        errors.push(`${mod} missing dependency: ${dep}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export default {
  bootRegistry,
  get,
  validateGraph
};
