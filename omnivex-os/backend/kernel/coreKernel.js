/**
 * OMNIVEX OS — CORE KERNEL v1
 * Deterministic execution loop for the entire system
 */

export function createCoreKernel({
  bus,
  mercury,
  sophia,
  overlord,
  capital,
  saint,
  ledger,
  elohim,
  chronicle,
  state
} = {}) {
  if (!bus) throw new Error("Bus required for core kernel");

  /**
   * =========================
   * EXECUTION CYCLE STATE
   * =========================
   */

  let cycleCount = 0;

  let lastMarket = null;

  /**
   * =========================
   * STEP 1 — INGEST
   * =========================
   */

  function ingest(event) {
    if (!event) return;

    chronicle?.append?.({
      type: "kernel.ingest",
      data: event
    });

    lastMarket = event;
    return event;
  }

  /**
   * =========================
   * STEP 2 — INTERPRET (SOPHIA)
   * =========================
   */

  function interpret(event) {
    if (!sophia) return null;

    return state?.getSignal?.() || null;
  }

  /**
   * =========================
   * STEP 3 — ROUTE (OVERLORD)
   * =========================
   */

  function route(signal) {
    if (!overlord) return null;

    return state?.getCapital?.() || null;
  }

  /**
   * =========================
   * STEP 4 — ALLOCATE (CAPITAL)
   * =========================
   */

  function allocate(signal) {
    if (!capital) return null;

    return capital.getPortfolio?.();
  }

  /**
   * =========================
   * STEP 5 — DECIDE (ELOHIM)
   * =========================
   */

  function decide(payload) {
    if (!elohim) return null;

    return elohim.getDecision?.() || null;
  }

  /**
   * =========================
   * STEP 6 — EXECUTE (SAINT)
   * =========================
   */

  function execute(decision) {
    if (!saint) return null;

    return {
      executed: true,
      decision
    };
  }

  /**
   * =========================
   * STEP 7 — LEARN (LEDGER)
   * =========================
   */

  function learn() {
    if (!ledger) return null;

    return ledger.getSummary?.() || null;
  }

  /**
   * =========================
   * FULL CYCLE
   * =========================
   */

  function cycle(event) {
    cycleCount++;

    const ingested = ingest(event);

    const signal = interpret(ingested);

    const routeData = route(signal);

    const allocation = allocate(routeData);

    const decision = decide({
      signal,
      route: routeData,
      portfolio: allocation
    });

    const execution = execute(decision);

    const learning = learn();

    const cycle = {
      type: "kernel.cycle",

      ts: Date.now(),

      cycleCount,

      ingested,
      signal,
      routeData,
      allocation,
      decision,
      execution,
      learning
    };

    bus.emit(cycle.type, cycle);
    chronicle?.append?.(cycle);

    return cycle;
  }

  /**
   * =========================
   * EVENT LISTENER
   * =========================
   */

  bus.onAny((event) => {
    /**
     * ONLY MARKET DRIVES KERNEL
     */
    if (event?.type === "market.tick") {
      cycle(event);
    }
  });

  return {
    getCycleCount: () => cycleCount
  };
}
