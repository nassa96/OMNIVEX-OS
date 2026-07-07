/**
 * SAINT V74 — REDIS ADAPTER (SIMPLIFIED)
 * Production message/state buffer abstraction
 */

class RedisAdapterV74 {

  constructor() {
    this.store = new Map();
  }

  set(key, value) {
    this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key);
  }
}

module.exports = RedisAdapterV74;
