/**
 * SAINT V101 — COMPLIANCE REPORTER
 */

class ComplianceReporterV101 {

  constructor() {
    this.logs = [];
  }

  record(event) {
    this.logs.push({
      ...event,
      ts: Date.now()
    });
  }

  export() {
    return {
      totalEvents: this.logs.length,
      logs: this.logs
    };
  }
}

module.exports = ComplianceReporterV101;
