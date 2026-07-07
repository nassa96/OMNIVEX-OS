/**
 * SAINT V82 — HARDENED EXECUTOR
 * Safe execution wrapper with retry protection
 */

class HardenedExecutorV82 {

  constructor(circuitBreaker, executor) {
    this.cb = circuitBreaker;
    this.executor = executor;
  }

  async execute(task) {

    if (!this.cb.allow()) {
      return { rejected: true, reason: "CIRCUIT_OPEN" };
    }

    try {

      const result = await this.executor.execute(task);

      this.cb.success();

      return result;

    } catch (err) {

      this.cb.failure();

      return {
        error: true,
        message: err.message
      };
    }
  }
}

module.exports = HardenedExecutorV82;
