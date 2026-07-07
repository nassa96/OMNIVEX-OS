/**
 * SAINT V92 — AUDIT ENGINE
 */

class AuditEngineV92 {

  constructor() {
    this.log = [];
  }

  record(event) {
    this.log.push({
      ...event,
      ts: Date.now()
    });
  }

  export() {
    return this.log;
  }
}

module.exports = AuditEngineV92;
