/**
 * OMNIVEX OS — STRATEGY MUTATION ENGINE v1
 * Evolves signal + execution parameters based on backtest performance
 */

export function createMutationEngine({ chronicle } = {}) {
  if (!chronicle) {
    throw new Error("Chronicle required for mutation engine");
  }

  /**
   * =========================
   * STRATEGY GENOME
   * =========================
   */

  let genome = {
    sophiA_weight: 1.0,
    risk_factor: 1.0,
    aggression: 0.5,
    execution_bias: 0.5
  };

  let history = [];

  /**
   * =========================
   * FITNESS FUNCTION
   * =========================
   */

  function fitness(backtestResult) {
    const pnl = backtestResult?.pnl || 0;
    const stability = 1 / (1 + Math.abs(pnl * 0.1));

    return pnl * stability;
  }

  /**
   * =========================
   * MUTATION LOGIC
   * =========================
   */

  function mutate() {
    genome.sophiA_weight += (Math.random() - 0.5) * 0.1;
    genome.risk_factor += (Math.random() - 0.5) * 0.1;
    genome.aggression += (Math.random() - 0.5) * 0.1;
    genome.execution_bias += (Math.random() - 0.5) * 0.1;

    // clamp values
    for (const k of Object.keys(genome)) {
      genome[k] = Math.max(0.1, Math.min(2.0, genome[k]));
    }

    return genome;
  }

  /**
   * =========================
   * EVOLUTION STEP
   * =========================
   */

  function evolve(backtestResult) {
    const score = fitness(backtestResult);

    history.push({
      genome: { ...genome },
      score
    });

    if (score < 0) {
      mutate();
    }

    return {
      genome,
      score
    };
  }

  /**
   * =========================
   * EXPORT STATE
   * =========================
   */

  function getGenome() {
    return genome;
  }

  function getHistory() {
    return history;
  }

  return {
    evolve,
    getGenome,
    getHistory
  };
}
