/**
 * SAINT V65 — RETRY ENGINE
 * Handles transient execution failures
 */

class ExecutionRetryV65 {

  constructor(maxRetries = 3) {
    this.maxRetries = maxRetries;
  }

  async execute(fn, payload) {

    let attempt = 0;

    while (attempt < this.maxRetries) {

      try {
        return await fn(payload);
      } catch (err) {

        attempt++;

        if (attempt >= this.maxRetries) {
          throw err;
        }
      }
    }
  }
}

module.exports = ExecutionRetryV65;
