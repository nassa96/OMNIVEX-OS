class Sophia {
  constructor(memory) {
    this.name = "SOPHIA_V17";
    this.memory = memory;

    this.bias = {
      HOLD: 0.4,
      BUY: 0.3,
      SELL: 0.3
    };

    this.learningRate = 0.05;
  }

  /**
   * ---------------------------
   * SIGNAL GENERATION (ADAPTIVE)
   * ---------------------------
   */
  analyze(market) {
    const learning = this.memory.generateLearningSignal();

    let signal = "HOLD";
    let confidence = 0.5;

    const volatility = Math.abs(market.price % 100) / 100;

    // Base directional bias
    if (volatility > 0.6) {
      signal = "WAIT";
      confidence = 0.4;
    }

    if (learning.winRate > 0.55) {
      signal = "BUY";
      confidence += 0.2;
    }

    if (learning.avgSlippage > 0.5) {
      signal = "WAIT";
      confidence -= 0.1;
    }

    // Bias correction over time
    this._adaptBias(signal, learning);

    return {
      signal,
      confidence: Math.max(0.05, Math.min(0.95, confidence)),
      price: market.price,
      learning
    };
  }

  /**
   * ---------------------------
   * BIAS ADAPTATION
   * ---------------------------
   */
  _adaptBias(signal, learning) {
    for (const key of Object.keys(this.bias)) {
      if (key === signal) {
        this.bias[key] += this.learningRate * learning.winRate;
      } else {
        this.bias[key] -= this.learningRate * (1 - learning.winRate);
      }
    }

    // normalize
    const sum = Object.values(this.bias).reduce((a, b) => a + b, 0);

    for (const k of Object.keys(this.bias)) {
      this.bias[k] /= sum;
    }
  }
}

module.exports = Sophia;
