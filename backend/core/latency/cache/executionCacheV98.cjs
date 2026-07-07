/**
 * SAINT V98 — EXECUTION CACHE
 */

class ExecutionCacheV98 {

  constructor() {
    this.cache = new Map();
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }
}

module.exports = ExecutionCacheV98;
