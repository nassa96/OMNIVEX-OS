/**
 * SAINT V82 — CIRCUIT BREAKER
 * Prevents cascading system failure
 */

class CircuitBreakerV82 {

  constructor(threshold = 5) {
    this.threshold = threshold;
    this.failures = 0;
    this.open = false;
  }

  success() {
    this.failures = 0;
    this.open = false;
  }

  failure() {
    this.failures++;

    if (this.failures >= this.threshold) {
      this.open = true;
    }
  }

  allow() {
    return !this.open;
  }

  state() {
    return {
      open: this.open,
      failures: this.failures
    };
  }
}

module.exports = CircuitBreakerV82;
