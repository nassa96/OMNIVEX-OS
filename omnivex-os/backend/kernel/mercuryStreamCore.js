/**
 * OMNIVEX OS — MERCURY v2 STREAMCORE
 * Multi-exchange ingestion + normalization + anomaly + memecoin burst detection
 */

export function createMercuryStreamCore({ bus, chronicle } = {}) {
  if (!bus) throw new Error("Bus required for Mercury StreamCore");

  /**
   * =========================
   * NORMALIZED MARKET STATE
   * =========================
   */

  const marketState = {
    BTC: { price: 0, volume: 0 },
    ETH: { price: 0, volume: 0 },
    ALT: { price: 0, volume: 0 }
  };

  /**
   * =========================
   * ANOMALY DETECTION
   * =========================
   */

  function detectSpike(symbol, price) {
    const prev = marketState[symbol]?.price || 0;

    if (prev === 0) return false;

    const change = Math.abs(price - prev) / prev;

    return change > 0.05; // 5% micro spike threshold
  }

  /**
   * =========================
   * MEME BURST DETECTOR (LOW LEVEL SIGNAL)
   * =========================
   */

  function detectMemeBurst(event) {
    const raw = JSON.stringify(event).toLowerCase();

    const triggers = ["pepe", "doge", "shib", "elon", "moon", "pump", "100x"];

    let score = 0;

    for (const t of triggers) {
      if (raw.includes(t)) score++;
    }

    return score >= 2;
  }

  /**
   * =========================
   * NORMALIZER
   * =========================
   */

  function normalize(event) {
    const data = event?.data || {};

    return {
      venue: data.venue || "unknown",
      asset: data.asset || "BTC",
      price: Number(data.price || 0),
      volume: Number(data.volume || 0),
      raw: event
    };
  }

  /**
   * =========================
   * STREAM PROCESSOR
   * =========================
   */

  function process(event) {
    const n = normalize(event);

    const spike = detectSpike(n.asset, n.price);
    const memeBurst = detectMemeBurst(event);

    marketState[n.asset] = {
      price: n.price,
      volume: n.volume
    };

    /**
     * CORE MARKET TICK
     */
    const tick = {
      type: "market.tick",

      ts: Date.now(),

      data: n
    };

    bus.emit(tick.type, tick);
    chronicle?.append?.(tick);

    /**
     * ANOMALY EVENT
     */
    if (spike) {
      const anomaly = {
        type: "market.anomaly.spike",

        ts: Date.now(),

        asset: n.asset,

        price: n.price
      };

      bus.emit(anomaly.type, anomaly);
      chronicle?.append?.(anomaly);
    }

    /**
     * MEME BURST EVENT
     */
    if (memeBurst) {
      const meme = {
        type: "market.meme.burst",

        ts: Date.now(),

        asset: n.asset,

        intensity: 1
      };

      bus.emit(meme.type, meme);
      chronicle?.append?.(meme);
    }

    return tick;
  }

  /**
   * =========================
   * EVENT LISTENER (RAW FEEDS)
   * =========================
   */

  bus.onAny((event) => {
    if (!event) return;

    /**
     * Accept raw multi-venue feeds
     */
    if (event.type === "raw.feed" || event.type === "exchange.tick") {
      process(event);
    }
  });

  return {
    getState: () => marketState
  };
}
