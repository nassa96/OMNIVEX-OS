/**
 * SAINT V71 — KEY VAULT
 * Centralized secure API key management
 */

class KeyVaultV71 {

  constructor(env) {
    this.env = env || {};
  }

  get(key) {

    if (!this.env[key]) {
      throw new Error(`[V71] Missing key: ${key}`);
    }

    return this.env[key];
  }

  has(key) {
    return !!this.env[key];
  }
}

module.exports = KeyVaultV71;
