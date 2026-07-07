/**
 * SAINT V83 — TRACER
 * Execution path tracing
 */

class TracerV83 {

  constructor() {
    this.traces = [];
  }

  trace(step, data) {

    this.traces.push({
      step,
      data,
      ts: Date.now()
    });
  }

  getTrace() {
    return this.traces;
  }
}

module.exports = TracerV83;
