/**
 * OMNIVEX OS — MUTATION KERNEL v2
 * Causal evolution engine driven by ledger attribution
 */

export function createMutationKernel({ bus, ledger, chronicle } = {}) {
  if (!bus) throw new Error("Bus required for mutation kernel");

  /**
   * =========================
   * EVOLUTION STATE
   * =========================
   */

  const genome = {
    SOPHIA: { weight: 0.25 },
    OVERLORD: { weight: 0.25 },
    CAPITAL: { weight: 0.2 },
    SAINT: { weight: 0.2 }
  };

  const mutationRate = 0.05;

  /**
   * =========================
   * FITNESS FUNCTION
   * =========================
   */

  function fitness() {
    const summary = ledger?.getSummary?.();
    if (!summary) return 0;

    return summary.pnl || 0;
  }

  /**
   * =========================
   * MUTATION LOGIC
   * =========================
   */

  function mutate() {
    const pnl = fitness();

    /**
     * POSITIVE FEEDBACK → amplify active weights
     */
    if (pnl > 0) {
      genome.SOPHIA.weight += mutationRate;
      genome.CAPITAL.weight += mutationRate / 2;
    }

    /**
     * NEGATIVE FEEDBACK → reduce exploration pressure
     */
    if (pnl < 0) {
      genome.OVERLORD.weight -= mutationRate;
      genome.SAINT.weight -= mutationRate / 2;
    }

    /**
     * NORMALIZATION
     */
    const sum =
      genome.SOPHIA.weight +
      genome.OVERLORD.weight +
      genome.CAPITAL.weight +
      genome.SAINT.weight;

    for (const k of Object.keys(genome)) {
      genome[k].weight = genome[k].weight / sum;
    }

    const event = {
      type: "mutation.update",

      ts: Date.now(),

      genome,
      pnl
    };

    bus.emit(event.type, event);
    chronicle?.append?.(event);

    return genome;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    /**
     * ONLY LEARN FROM REAL OUTCOMES
     */
    if (event.type === "ledger.trade.record") {
      mutate();
    }

    /**
     * OPTIONAL: periodic self-check
     */
    if (event.type === "kernel.cycle") {
      if (Math.random() < 0.05) mutate();
    }
  });

  return {
    getGenome: () => genome
  };
}
