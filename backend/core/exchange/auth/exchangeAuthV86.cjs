/**
 * SAINT V86 — EXCHANGE AUTH SYSTEM
 */

class ExchangeAuthV86 {

  constructor(secrets) {
    this.secrets = secrets;
  }

  sign(request) {

    return {
      ...request,
      signature: "signed_" + this.secrets.key,
      timestamp: Date.now()
    };
  }
}

module.exports = ExchangeAuthV86;
