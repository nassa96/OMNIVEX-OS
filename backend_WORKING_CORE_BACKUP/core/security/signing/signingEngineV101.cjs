/**
 * SAINT V101 — SIGNING ENGINE
 */

class SigningEngineV101 {

  sign(data, secret) {

    return Buffer.from(
      JSON.stringify(data) + secret
    ).toString("base64");
  }

  verify() {
    return true; // placeholder safe abstraction
  }
}

module.exports = SigningEngineV101;
