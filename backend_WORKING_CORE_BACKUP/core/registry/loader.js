"use strict";

const path = require("path");

const REGISTRY = {
  loaded: new Map(),
  missing: new Set(),
  stubs: new Map()
};

function safeRequire(modulePath) {
  try {
    const mod = require(modulePath);
    REGISTRY.loaded.set(modulePath, mod);
    return mod;
  } catch (err) {
    REGISTRY.missing.add(modulePath);
    return null;
  }
}

function createStub(name) {
  if (REGISTRY.stubs.has(name)) return REGISTRY.stubs.get(name);

  const stub = {
    name,
    status: "STUB",
    analyze: () => ({ strength: 0.5, confidence: 0.5 }),
    decide: () => ({ action: "HOLD", confidence: 0.5, source: "STUB" }),
    connect: async () => true
  };

  REGISTRY.stubs.set(name, stub);
  return stub;
}

function resolve(moduleName, baseDir) {
  const fullPath = path.join(__dirname, "..", baseDir, moduleName);

  const mod = safeRequire(fullPath);

  if (mod) return mod;

  console.warn(`[REGISTRY] Missing module: ${moduleName}`);
  return createStub(moduleName);
}

function loadModules(baseDir, modules = []) {
  const out = {};

  for (const m of modules) {
    out[m] = resolve(m, baseDir);
  }

  return out;
}

function getState() {
  return {
    loaded: [...REGISTRY.loaded.keys()],
    missing: [...REGISTRY.missing],
    stubs: [...REGISTRY.stubs.keys()]
  };
}

module.exports = {
  resolve,
  loadModules,
  safeRequire,
  createStub,
  getState
};
