/**
 * SAINT V83 — METRICS ENGINE
 */

class MetricsV83 {

  constructor() {
    this.metrics = {};
  }

  inc(key) {
    this.metrics[key] = (this.metrics[key] || 0) + 1;
  }

  get() {
    return this.metrics;
  }
}

module.exports = MetricsV83;
