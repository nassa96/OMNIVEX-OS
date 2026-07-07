/**
 * SAINT V50.1 — DRIFT DETECTOR (HARDENED)
 */

class GovernorDriftV50_1 {

  constructor() {
    this.records = {};
  }

  log(governor, context, pnl) {

    if (!this.records[governor]) {
      this.records[governor] = [];
    }

    this.records[governor].push({
      context,
      pnl,
      ts: Date.now()
    });

    if (this.records[governor].length > 300) {
      this.records[governor].shift();
    }
  }

  detect(governor) {

    const data = this.records[governor] || [];

    if (data.length < 25) {
      return { drift: false, confidence: 0 };
    }

    const manip = data.filter(d =>
      d.context === "MANIPULATION" && d.pnl < 0
    ).length;

    const total = data.filter(d =>
      d.context === "MANIPULATION"
    ).length || 1;

    const score = manip / total;

    return {
      drift: score > 0.6,
      confidence: score
    };
  }
}

module.exports = GovernorDriftV50_1;
