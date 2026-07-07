/**
 * SAINT V26 — Execution Memory Layer
 * ----------------------------------
 * Learns from real execution outcomes:
 * - slippage error
 * - decision quality drift
 * - execution success/failure
 * - routing effectiveness
 */

class ExecutionMemory {
  constructor() {
    this.records = [];
    this.biasMap = {
      slippage: 0,
      adverseSelection: 0,
      executionQuality: 1
    };
  }

  /**
   * Record full execution cycle
   */
  record({ cognition, execution, market }) {
    const entry = {
      ts: Date.now(),
      price: market.price,
      signal: cognition.signal,
      decision: cognition.decision,
      executionStatus: execution.status,
      slippage: cognition.slippage || 0,
      adverse: cognition.adverse || 0,
      liquidity: cognition.liquidity || 0,
      executionQuality: cognition.executionQuality || 0
    };

    this.records.push(entry);
    if (this.records.length > 500) this.records.shift();

    this.updateBias(entry);
    return entry;
  }

  /**
   * Adaptive bias correction
   */
  updateBias(entry) {
    // Slippage drift learning
    this.biasMap.slippage =
      this.biasMap.slippage * 0.95 + entry.slippage * 0.05;

    // Adverse selection drift
    this.biasMap.adverseSelection =
      this.biasMap.adverseSelection * 0.95 + entry.adverse * 0.05;

    // Execution quality smoothing
    this.biasMap.executionQuality =
      this.biasMap.executionQuality * 0.95 + entry.executionQuality * 0.05;
  }

  /**
   * Detect degraded conditions
   */
  regime() {
    if (this.biasMap.slippage > 0.5) return "TOXIC_LIQUIDITY";
    if (this.biasMap.adverseSelection > 0.6) return "FAST_MARKET";
    if (this.biasMap.executionQuality < 0.4) return "BROKEN_FLOW";
    return "NORMAL";
  }

  /**
   * Feedback adjustment signal for V25/V27 layers
   */
  feedbackSignal() {
    return {
      slippageBias: this.biasMap.slippage,
      adverseBias: this.biasMap.adverseSelection,
      qualityBias: this.biasMap.executionQuality,
      regime: this.regime()
    };
  }

  /**
   * Execution performance summary
   */
  summary() {
    const last = this.records.slice(-50);

    const avgSlippage =
      last.reduce((a, b) => a + b.slippage, 0) / (last.length || 1);

    const avgQuality =
      last.reduce((a, b) => a + b.executionQuality, 0) / (last.length || 1);

    return {
      avgSlippage,
      avgQuality,
      regime: this.regime(),
      records: this.records.length
    };
  }
}

module.exports = ExecutionMemory;
