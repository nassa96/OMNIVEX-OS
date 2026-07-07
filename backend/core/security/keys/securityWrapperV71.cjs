/**
 * SAINT V71 — SECURITY WRAPPER
 * Runtime-safe access layer for secrets
 */

class SecurityWrapperV71 {

  constructor(vault) {
    this.vault = vault;
  }

  getBinanceKey() {
    return this.vault.get("BINANCE_API_KEY");
  }

  getCoinbaseKey() {
    return this.vault.get("COINBASE_API_KEY");
  }
}

module.exports = SecurityWrapperV71;
