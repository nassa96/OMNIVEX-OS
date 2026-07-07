/**
 * SAINT V96 — CIRCUIT BREAKER
 */

class CircuitBreakerV96 {

  constructor(threshold = 5) {
    this.failures = 0;
    this.threshold = threshold;
    this.open = false;
  }

  recordFailure() {
    this.failures++;

    if (this.failures >= this.threshold) {
      this.open = true;
    }
  }

  allow() {
    return !this.open;
  }

  reset() {
    this.failures = 0;
    this.open = false;
  }
}

module.exports = CircuitBreakerV96;
