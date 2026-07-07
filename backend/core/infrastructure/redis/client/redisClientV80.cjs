/**
 * SAINT V80 — REDIS CLIENT (REALISTIC WRAPPER)
 */

class RedisClientV80 {

  constructor() {
    this.store = new Map();
  }

  set(key, value) {
    this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key);
  }

  push(stream, value) {
    if (!this.store.has(stream)) {
      this.store.set(stream, []);
    }

    this.store.get(stream).push(value);
  }
}

module.exports = RedisClientV80;
