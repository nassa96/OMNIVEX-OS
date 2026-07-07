/**
 * OMNIVEX OS — OMEGA CONSCIOUSNESS LAYER v1
 * Recursive self-reflective decision memory system
 */

export function createOmegaConsciousness({
  bus,
  ledger,
  chronicle,
  mutation,
  state
} = {}) {
  if (!bus) throw new Error("Bus required for omega layer");

  /**
   * =========================
   * MEMORY VECTOR SPACE
   * =========================
   */

  const memory = [];

  const MAX_MEMORY = 200;

  /**
   * =========================
   * MEMORY INGESTION
   * =========================
   */

  function ingest(event) {
    const entry = {
      ts: Date.now(),
      type: event?.type,
      payload: event
    };

    memory.push(entry);

    if (memory.length > MAX_MEMORY) {
      memory.shift();
    }

    chronicle?.append?.({
      type: "omega.memory.ingest",
      data: entry
    });

    return entry;
  }

  /**
   * =========================
   * REFLECTION ENGINE
   * =========================
   */

  function reflect() {
    const summary = ledger?.getSummary?.() || {};

    const pnl = summary.pnl || 0;

    const recentTrades = summary.trades || 0;

    const memoryPressure = memory.length / MAX_MEMORY;

    const reflection = {
      type: "omega.reflection",

      ts: Date.now(),

      pnl,

      recentTrades,

      memoryPressure,

      regime:
        pnl > 0
          ? "EXPANSION"
          : pnl < 0
          ? "CONTRACTION"
          : "NEUTRAL",

      stabilityScore:
        (pnl > 0 ? 1 : -1) * (1 - memoryPressure)
    };

    return reflection;
  }

  /**
   * =========================
   * SELF-ADJUSTMENT LOOP
   * =========================
   */

  function adapt(reflection) {
    if (!mutation) return;

    /**
     * If system is unstable → increase exploration pressure
     */
    if (reflection.regime === "CONTRACTION") {
      bus.emit("omega.mutation.force", {
        type: "mutation.override",

        intensity: 1.5
      });
    }

    /**
     * If stable → reinforce current genome
     */
    if (reflection.regime === "EXPANSION") {
      bus.emit("omega.mutation.reinforce", {
        type: "mutation.reinforce"
      });
    }
  }

  /**
   * =========================
   * CORE LOOP
   * =========================
   */

  function cycle(event) {
    ingest(event);

    const reflection = reflect();

    adapt(reflection);

    const omegaEvent = {
      type: "omega.cycle",

      ts: Date.now(),

      reflection
    };

    bus.emit(omegaEvent.type, omegaEvent);
    chronicle?.append?.(omegaEvent);

    return omegaEvent;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    /**
     * EVERYTHING FEEDS OMEGA
     */
    cycle(event);
  });

  return {
    getMemory: () => memory,
    reflect
  };
}
