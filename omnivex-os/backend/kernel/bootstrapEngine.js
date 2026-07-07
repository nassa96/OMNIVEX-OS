/**
 * OMNIVEX OS — BOOTSTRAP ENGINE v1
 * Synthetic market replay + training environment
 */

export function createBootstrapEngine({ bus, chronicle, state } = {}) {
  if (!bus) throw new Error("Bus required for bootstrap engine");

  /**
   * =========================
   * SYNTHETIC MARKET GENERATOR
   * =========================
   */

  const assets = ["BTC", "ETH", "SOL"];

  let t = 0;

  function randomWalk(price) {
    const drift = (Math.random() - 0.5) * 0.002;
    return price * (1 + drift);
  }

  /**
   * =========================
   * INITIAL STATE
   * =========================
   */

  const market = {
    BTC: 65000,
    ETH: 3500,
    SOL: 120
  };

  /**
   * =========================
   * SYNTHETIC TICK GENERATOR
   * =========================
   */

  function generateTick() {
    t++;

    const asset = assets[Math.floor(Math.random() * assets.length)];

    const price = randomWalk(market[asset]);

    market[asset] = price;

    return {
      type: "market.tick",

      ts: Date.now(),

      data: {
        asset,
        price,
        volume: Math.random() * 1000,
        venue: "synthetic"
      }
    };
  }

  /**
   * =========================
   * TRAINING LOOP
   * =========================
   */

  function startSimulation(interval = 1000) {
    setInterval(() => {
      const tick = generateTick();

      bus.emit(tick.type, tick);
      chronicle?.append?.(tick);
    }, interval);
  }

  /**
   * =========================
   * EVENT LEARNING FEED
   * =========================
   */

  bus.onAny((event) => {
    if (!event) return;

    /**
     * OPTIONALLY ADAPT SPEED BASED ON OMEGA
     */
    if (event.type === "omega.reflection") {
      if (event.reflection?.regime === "CONTRACTION") {
        // slow learning when unstable
        startSimulation(2000);
      }

      if (event.reflection?.regime === "EXPANSION") {
        // accelerate learning when stable
        startSimulation(500);
      }
    }
  });

  return {
    startSimulation
  };
}
