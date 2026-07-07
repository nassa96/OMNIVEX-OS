/**
 * SAINT V87 — SECRETS MANAGER
 */

class SecretsManagerV87 {

  constructor(env) {
    this.env = env;
  }

  get(key) {
    return this.env[key] || null;
  }

  has(key) {
    return !!this.env[key];
  }
}

module.exports = SecretsManagerV87;
