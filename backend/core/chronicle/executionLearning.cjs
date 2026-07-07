class ExecutionLearningLoop {
  constructor() {
    this.samples = [];
    this.regimeBias = new Map();
  }

  record({ regime, quality, signal }) {
    const entry = {
      regime,
      score: quality.score,
      slippage: quality.slippage,
      timestamp: Date.now(),
      signalConfidence: signal.confidence
    };

    this.samples.push(entry);

    if (this.samples.length > 1000) {
      this.samples.shift();
    }

    this._updateRegimeBias(regime, entry);
  }

  _updateRegimeBias(regime, entry) {
    const key = regime || "UNKNOWN";

    if (!this.regimeBias.has(key)) {
      this.regimeBias.set(key, {
        avgScore: 0,
        count: 0
      });
    }

    const stats = this.regimeBias.get(key);

    stats.avgScore =
      (stats.avgScore * stats.count + entry.score) /
      (stats.count + 1);

    stats.count += 1;

    this.regimeBias.set(key, stats);
  }

  getRegimeQuality(regime) {
    return this.regimeBias.get(regime) || {
      avgScore: 0.5,
      count: 0
    };
  }
}

module.exports = ExecutionLearningLoop;
