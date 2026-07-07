/**
 * SAINT V84 — PRODUCTION CORE ORCHESTRATOR
 */

class SaintProductionCoreV84 {

  constructor({
    executor,
    circuitBreaker,
    logger,
    metrics,
    tracer,
    watchdog
  }) {

    this.executor = executor;
    this.cb = circuitBreaker;
    this.logger = logger;
    this.metrics = metrics;
    this.tracer = tracer;
    this.watchdog = watchdog;
  }

  async run(task) {

    this.tracer.trace("START", task);

    if (!this.cb.allow()) {
      this.logger.error("Circuit open", {});
      return { rejected: true };
    }

    try {

      const result = await this.executor.execute(task);

      this.cb.success();
      this.metrics.inc("exec_success");

      this.watchdog.tick(true);

      this.logger.info("Execution success", result);

      this.tracer.trace("SUCCESS", result);

      return result;

    } catch (err) {

      this.cb.failure();
      this.metrics.inc("exec_failure");

      this.watchdog.tick(false);

      this.logger.error("Execution failed", err);

      this.tracer.trace("FAILURE", err);

      return { error: true };
    }
  }
}

module.exports = SaintProductionCoreV84;
